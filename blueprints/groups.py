from services.db import supabase
from services.login_required import login_required
from flask import Blueprint,Flask,flash,redirect,render_template,request,session,url_for,abort
from uuid import UUID
from services.compute_group_balances import compute_group_balances

group_bp = Blueprint('groups',__name__, url_prefix='/groups')
@group_bp.route('/')
@login_required
def index():
    uid = session['user_id']
    res = supabase.table('groups').select('id,name,created_at,group_members!inner(user_id)').eq('group_members.user_id',uid).execute()
    groups = res.data or []
    return render_template('groups/index.html', groups=groups)

@group_bp.route('/create',methods=['POST','GET'])
@login_required
def create_group():
    if request.method == 'POST':
        name = request.form.get('name',"").strip()
        if not name:
            flash('Group name is required',"error")
            return redirect(url_for('groups.create_group'))
        uid = session['user_id']
        gres = supabase.table('groups').insert({'name':name,'created_by':uid}).execute()
        group = (gres.data or [None])[0]
        if not group:
            flash('Failed to create group',"error")
            return redirect(url_for('groups.index'))
        supabase.table('group_members').insert({'group_id':group['id'],'user_id':uid,'role':'admin'}).execute()
        flash('group created! ','success')
        return redirect(url_for('groups.group_detail',group_id=group['id']))
    return render_template('groups/create_group.html')
@group_bp.route('/<group_id>')
@login_required
def group_detail(group_id):
    try:
        UUID(group_id)
    except Exception:
        abort(404)
    
    group_info = supabase.table('groups').select('*').eq('id',group_id).limit(1).execute()
    group = (group_info.data or [None])[0]
    if not group:
        abort(404)
    initial_member_list = supabase.table('group_members').select('user_id,role,users(username,email)').eq('group_id',group_id).execute()
    members = (initial_member_list.data or [])
    if not members:
        flash('No members found for this group',"error")
        return redirect(url_for('groups.index'))
    initial_expenses_list = supabase.table('expenses').select('id,desciption,amount,paid_by,cretaed_at,users(username)').eq('group_id',group_id).execute()
    expenses = (initial_expenses_list.data or [])
    if not expenses:
        flash('No expenses found for this group',"info")
        return render_template(url_for('groups.index'))
    balances = compute_group_balances(group_id)
    return render_template("groups/detail.html",
                           group=group, members=members, expenses=expenses, balances=balances)
    

