from services.db import supabase
from services.login_required import login_required
from flask import Blueprint,Flask,flash,redirect,render_template,request,session,url_for,abort
from uuid import UUID
from services.compute_group_balances import compute_group_balances
from forms.groups import CreateGroupForm,DeleteGroupForm,EditGroupForm
from forms.expenses import AddExpenseForm
from forms.settlement import SettlementForm
 
group_bp = Blueprint('groups',__name__, url_prefix='/groups')
@group_bp.route('/')
@login_required
def index():
    uid = session['user_id']
    res = supabase.table('groups') \
        .select('id, name, created_at, group_members!inner(user_id)') \
        .eq('group_members.user_id', uid) \
        .execute()
 
    groups_raw = res.data or []
    groups = []
 
    for g in groups_raw:
        # Count members for each group
        count_res = supabase.table('group_members').select('user_id').eq('group_id', g['id']).execute()
        member_count = len(count_res.data or [])
 
        groups.append({
            'id': g['id'],
            'name': g['name'],
            'count': member_count
        })
 
    return render_template('groups.html', groups=groups)
 
 
@group_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create_group():
    form = CreateGroupForm()
 
    if form.validate_on_submit():
        uid = session.get('user_id')
        name = form.group_name.data.strip()
        description = form.description.data.strip()
        members = [m.strip().lower() for m in form.members.data if m.strip()]
 
       
        gres = supabase.table('groups').insert({'name': name, 'created_by': uid}).execute()
        group = (gres.data or [None])[0]
        if not group:
            flash('Failed to create group', 'error')
            return redirect(url_for('groups.create_group'))
 
     
        supabase.table('group_members').insert({
            'group_id': group['id'],
            'user_id': uid,
            'role': 'admin'
        }).execute()
 
       
        for email in members:
            user_lookup = supabase.table('users').select('id').eq('email', email).execute()
            if user_lookup.data:
                supabase.table('group_members').insert({
                    'group_id': group['id'],
                    'user_id': user_lookup.data[0]['id'],
                    'role': 'member'
                }).execute()
            else:
                flash(f" User with email '{email}' not found.", 'warning')
 
        flash('✅ Group created successfully!', 'success')
        return redirect(url_for('groups.index'))
 
   
    return render_template('create-group.html', form=form)
 
@group_bp.route('/<group_id>')
@login_required
def group_detail(group_id):
    try:
        UUID(group_id)
    except Exception:
        abort(404)
   
    add_expense_form = AddExpenseForm()
    settle_form = SettlementForm()
    delete_group_form = DeleteGroupForm()
   
    group_info = supabase.table('groups').select('*').eq('id', group_id).limit(1).execute()
    group = (group_info.data or [None])[0]
    if not group:
        abort(404)
 
   
    initial_member_list = supabase.table('group_members').select('user_id, role, users(username, email)').eq('group_id', group_id).execute()
    members = (initial_member_list.data or [])
    if not members:
        flash('No members found for this group', "error")
        return redirect(url_for('groups.index'))
    add_expense_form.paid_by.choices = [(m['user_id'], m['users']['username']) for m in members]
    settle_form.pay_to.choices = [(m['user_id'],m['users']['username']) for m in members if m['user_id']!= session.get('user_id')]
 
   
    initial_expenses_list = supabase.table('expenses').select(
        'id, description, amount, paid_by, created_at, users:paid_by(username)'
    ).eq('group_id', group_id).execute()
    expenses = (initial_expenses_list.data or [])
 
    balances = compute_group_balances(group_id)
 
    return render_template("group_detail.html", group=group, members=members, expenses=expenses, balances=balances,add_expense_form=add_expense_form,
        settle_form=settle_form,delete_group_form=delete_group_form)

@group_bp.route('/<group_id>/delete',methods = ['POST','GET'])
@login_required
def delete_group(group_id):
    try:
        UUID(group_id)
    except Exception:
        abort(404)
    user_id = session.get('user_id')
    members_res = supabase.table('group_members').select('role').eq('group_id',group_id).eq('user_id',user_id).execute()
    if not members_res.data or members_res.data[0]['role']!='admin':
        flash('only admins can delete the group','error')
        return redirect(url_for('groups.group_detail',group_id=group_id))
    balances = compute_group_balances(group_id)
    unsettled = [b for b in balances if round(b['net'],2)!=0]
    if unsettled:
        flash('Cannot delete group with unsettled balances','error')
        return redirect(url_for('groups.group_detail',group_id=group_id))
    supabase.table('group_members').delete().eq('group_id',group_id).execute()
    supabase.table('groups').delete().eq('id',group_id).execute()
    supabase.table('expenses').delete().eq('group_id',group_id).execute()
    supabase.table('expenses_shares').delete().eq('user_id',user_id).execute()
    supabase.table('settlements').delete().eq('group_id',group_id).execute()
    flash('Group deleted successfully','success')
    return redirect(url_for('groups.index'))

@group_bp.route('/<group_id>/edit', methods=['GET','POST'])
@login_required
def edit_group(group_id):
    user_id = session.get('user_id')
    member_res = supabase.table('group_members').select('role').eq('group_id',group_id).eq('user_id',user_id).single().execute()
    if not member_res.data or member_res.data['role']!='admin':
        flash('Only admins can edit the group','error')
        return redirect(url_for('groups.group_detail',group_id=group_id))
    group_info_res = supabase.table('groups').select('*').eq('id',group_id).limit(1).execute()
    group = (group_info_res.data or [None])[0]
    if not group:
        flash('Group not found','error')
        return redirect(url_for('groups.index'))
    edit_form = EditGroupForm(data={
        'group_name':group['name']
    })
    member_res = supabase.table('group_members').select('user_id,users(username),role').eq('group_id',group_id).execute()
    member = member_res.data or []
    edit_form.member_to_remove.choices = [(m['user_id'],m['users']['username']) for m in member if m['user_id']!=user_id]

    if edit_form.validate_on_submit():
        changes_made = False
        new_name = edit_form.group_name.data.strip()
        new_description = edit_form.description.data.strip()
        if new_name != group['name']:
            supabase.table('groups').update({'name':new_name}).eq('id',group_id).execute()
            flash('Group name updated','success')
            changes_made = True


        if edit_form.email.data:
            email_to_add = edit_form.email.data.strip().lower()
            check_user = supabase.table('users').select('id').eq('email',email_to_add).limit(1).execute()
            user_to_add = (check_user.data or [None])[0]
            if not user_to_add:
                flash(f'User with email {email_to_add} not found','error')
            else:
                user_id_to_add = user_to_add['id']
                existing_member = supabase.table('group_members').select('user_id').eq('group_id',group_id).eq('user_id',user_id_to_add).limit(1).execute()
                if existing_member.data:
                    flash(f'User with email {email_to_add} is already a member','warning')
                else:
                    supabase.table('group_members').insert({
                        'group_id':group_id,
                        'user_id':user_id_to_add,
                        'role':'member'
                    }).execute()
                    flash(f'User with email {email_to_add} added to group','success')
                    changes_made = True
            
        if edit_form.member_to_remove.data:
            user_id_to_remove = edit_form.member_to_remove.data
            balances = compute_group_balances(group_id)
            unsettled = next((b for b in balances if b['user_id']==user_id_to_remove and round(b['net'],2)!=0),None)
            if unsettled:
                flash(" Cannot remove member with unsettled balances", "error")
            else:
                supabase.table("group_members").delete().eq("group_id", group_id).eq("user_id", user_id_to_remove).execute()
                flash("✅ Member removed successfully", "success")
                changes_made = True
            if not changes_made:
                flash("No changes made", "info")
                return redirect(url_for('groups.edit_group', group_id=group_id))
    return render_template(
        "edit_group.html",
        edit_form=edit_form,
        group=group,
        member=member)
    
        




    