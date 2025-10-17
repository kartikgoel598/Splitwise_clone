from flask import Flask,Blueprint,request,redirect,url_for,render_template,flash,session
from services.db import supabase
from uuid import uuid4
from datetime import datetime
from services.login_required import login_required

expenses_bp = Blueprint('expenses',__name__)


@expenses_bp.route('/groups/<group_id>/expenses')
@login_required
def view_expenses(group_id):
    user = session['user']
    result = supabase.table('expenses').select('*').eq('group_id', group_id).order('created_at',desc = True).execute()
    expenses = (result.data or [])
    return render_template('expenses.html', expenses=expenses, group_id=group_id, user=user)


@expenses_bp.route('/groups/<group_id>/add_expenses',methods = ['GET','POST'])
@login_required
def add_expenses(group_id):
    if request.method == 'POST':

        try:
            description = request.form.get('description',"").strip()
            amount = float(request.form.get('amount',0))
            paid_by = session['user_id']
            if not description or amount <= 0:
                flash('Description and valid amount are required',"error")
                return redirect(url_for('expenses.add_expenses', group_id=group_id))
            result = supabase.table('expenses').insert({
                'id': str(uuid4()),
                'group_id':group_id,
                'paid_by': paid_by,
                'description': description,
                'amount': amount,
                'created_at': datetime.utcnow().isoformat()}).execute()
            if not result.data:
                flash('Failed to add expense. Please try again.',"error")
                return redirect(url_for('expenses.add_expenses', group_id=group_id))
            flash('Expense added successfully!',"success")
            return redirect(url_for('expenses.view_expenses', group_id=group_id))
        
        except Exception as e:
            return f'an error occured : {str(e)}'
            


