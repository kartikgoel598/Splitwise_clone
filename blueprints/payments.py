from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from services.db import supabase
from datetime import datetime
from forms.settlement import SettlementForm
from forms.expenses import AddExpenseForm
from services.login_required import login_required
from services.compute_group_balances import compute_group_balances 
from flask import jsonify
from services.paypal import create_order , capture_order


payments_bp = Blueprint('payments', __name__, template_folder='templates')

def check_user_in_group(user_id, group_id):
    res = supabase.table('group_members').select('user_id').eq('group_id', group_id).eq('user_id', user_id).execute()
    return bool(res.data)

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

@payments_bp.route('/groups/<group_id>/settlement/start',methods=['POST','GET'])
#@login_required
def start_settlement(group_id):
    from app import csrf
    csrf.exempt(start_settlement)
    user_id = session.get('user_id')
    print("=== PayPal Settlement Start Debug ===")
    print("Group ID:", group_id)
    print("User ID:", user_id)
    print("Request path:", request.path)
    print("Request headers:", dict(request.headers))
    print("Raw request data:", request.data)
    try:
        data = request.get_json(force=True)
        print("Parsed JSON:", data)
    except Exception as e:
        print("JSON decode error:", e)
        return jsonify({"error": "Invalid JSON"}), 400

    if not data:
        return jsonify({"error": "Empty JSON"}), 400

    receiver_id = data.get("receiver_id")
    amount = data.get("amount")
    print("receiver_id:", receiver_id, "amount:", amount)

    if not receiver_id or not amount:
        return jsonify({"error": "receiver_id and amount required"}), 400
    settlement_insertion = supabase.table('settlements').insert({
        "group_id": group_id,
        "sender_id": user_id,
        "receiver_id": receiver_id,
        "amount": float(amount),
        "status": "pending",
        "settled_at": None
    }).execute()
    settlement = (settlement_insertion.data or [None])[0]
    if not settlement:
        return jsonify({"error": "failed to insert settlement"}), 500
    paypal_id = create_order(amount=f"{float(amount):.2f}")
    order_id = paypal_id.get('id')
    supabase.table("settlements").update({"paypal_order_id": order_id}).eq("id", settlement["id"]).execute()

    return jsonify({"settlement_id": settlement["id"], "order_id": order_id})



@payments_bp.route('/groups/<group_id>/settlement/capture',methods = ['POST','GET'])
#@login_required
def capture_settlement(group_id):
    from app import csrf
    csrf.exempt(capture_settlement)
    user_id = session.get('user_id')
    data = request.get_json(force = True)
    order_id = data.get("order_id")
    settlement_id = data.get("settlement_id")
    if not settlement_id or not order_id:
        return jsonify({'error':'settlement and order id is required'}),400
    settlement_res = supabase.table('settlements').select('*').eq('id',settlement_id).limit(1).execute()
    settlements = (settlement_res.data or [None])[0]
    if not settlements:
        return jsonify({"error": "settlement not found"}), 404

    if settlements["sender_id"] != user_id:
        return jsonify({"error": "not your settlement"}), 403
    capture_function_response= capture_order(order_id)
    pu = capture_function_response["purchase_units"][0]
    capture_obj = pu["payments"]["captures"][0]
    status = capture_obj["status"]
    capture_value = capture_obj["amount"]["value"]
    payer_email = capture_function_response.get("payer", {}).get("email_address")

    if float(capture_value) != float(settlements["amount"]):
        return jsonify({"error": "amount mismatch"}), 400

    supabase.table("settlements").update({
        "status": "completed" if status == "COMPLETED" else status.lower(),
        "settled_at": datetime.utcnow().isoformat(),
        "paypal_capture_id": capture_obj["id"],
        "payer_email": payer_email
    }).eq("id", settlement_id).execute()

    return jsonify({"ok": True, "status": status})



@payments_bp.route('/paypal/success')
def paypal_success():
    from app import csrf
    csrf.exempt(paypal_success)
    order_id = request.args.get('token')
    print('paypal success called with order id:',order_id)

    settlement_res = supabase.table('settlements').select('*').eq('paypal_order_id',order_id).limit(1).execute()
    settlement = (settlement_res.data or [None])[0]
    if not settlement:
        flash('settlement not found','error')
        return redirect(url_for('dashboard'))
    settlement_id = settlement['id']
    group_id = settlement['group_id']

    capture_function_response = capture_order(order_id)
    pu = capture_function_response['purchase_units'][0]
    capture_obj = pu['payments']['captures'][0]
    status = capture_obj['status']
    capture_value = capture_obj['amount']['value']
    payer_email = capture_function_response.get('payer', {}).get('email_address')
    if float(capture_value) != float(settlement["amount"]):
        return jsonify({"error": "amount mismatch"}), 400

    supabase.table("settlements").update({
        "status": "completed" if status == "COMPLETED" else status.lower(),
        "settled_at": datetime.utcnow().isoformat(),
        "paypal_capture_id": capture_obj["id"],
        "payer_email": payer_email
    }).eq("id", settlement_id).execute()
    flash(" Payment successful via PayPal!", "success")
    return redirect(url_for("groups.group_detail", group_id=group_id))

@payments_bp.route("/paypal/cancel")
def paypal_cancel():
    flash("Payment cancelled.", "info")
    return redirect(url_for("dashboard"))




