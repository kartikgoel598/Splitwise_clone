from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from services.db import supabase
from datetime import datetime
from forms.settlement import SettlementForm
from forms.expenses import AddExpenseForm
from services.login_required import login_required
from services.compute_group_balances import compute_group_balances
payments_bp = Blueprint('payments', __name__, template_folder='templates')

@payments_bp.route('/groups/<group_id>/settle', methods=['POST', 'GET'])
@login_required
def settle_up(group_id):
    form = SettlementForm()
    user_id = session.get('user_id')

    
    group_res = supabase.table('groups').select('*').eq('id', group_id).single().execute()
    group = group_res.data

    
    group_members_res = supabase.table('group_members').select('user_id, users(username)').eq('group_id', group_id).execute()
    members = group_members_res.data or []

    if not members:
        flash('No members found for this group', "error")
        return redirect(url_for('groups.index'))

   
    form.pay_to.choices = [(m['user_id'], m['users']['username']) for m in members if m['user_id'] != user_id]

   
    if form.validate_on_submit():
        pay_to = form.pay_to.data
        amount = form.amount.data

        supabase.table('settlements').insert({
            'group_id': group_id,
            'sender_id': user_id,
            'receiver_id': pay_to,
            'amount': float(amount),
            'status': 'completed',
            'settled_at': datetime.utcnow().isoformat()
        }).execute()

        flash("Settlement recorded successfully!", "success")
        return redirect(url_for('groups.group_detail', group_id=group_id))

    
    expenses_list = supabase.table('expenses').select('id, description, amount, paid_by, users:paid_by(username)').eq('group_id', group_id).execute()
    expenses = expenses_list.data or []

    
    balances = compute_group_balances(group_id)

    
    return render_template(
        "group_detail.html",
        group=group,
        members=members,
        expenses=expenses,
        balances=balances,
        add_expense_form=AddExpenseForm(),
        settle_form=form
    )
