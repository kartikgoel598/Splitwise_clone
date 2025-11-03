from services.db import supabase
from collections import defaultdict
from flask import flash
from flask import redirect ,url_for
def compute_group_balances(group_id : str):
    group_members_res = supabase.table('group_members').select('user_id,users(username)').eq('group_id',group_id).execute()
    members = group_members_res.data or []
    members_map = {m['user_id']:m['users']['username'] for m in members if 'users' in m}
    expenses_list = supabase.table('expenses').select('id,amount,paid_by,users:paid_by(username)').eq('group_id',group_id).execute()
    expenses = (expenses_list.data or [])

    expenses_id = [exp_id['id'] for exp_id in expenses]
    shares = []
    if expenses_id:
        shares_initial_list = supabase.table('expenses_shares').select('expense_id,user_id,share_amount').in_('expense_id',expenses_id).execute()
        shares = (shares_initial_list.data or [])
    
    settlements_initial_list = supabase.table('settlements').select('id,sender_id,receiver_id,amount,status').eq('group_id',group_id).execute()
    settlements = (settlements_initial_list.data or [])
    
    balances = defaultdict(lambda:0.0)
    for ex in expenses:
        balances[ex['paid_by']] += float(ex['amount'])
    for sh in shares:
        balances[sh['user_id']] -= float(sh['share_amount'])
    
    for settle in settlements:
        sender_id = settle['sender_id']
        receiver_id = settle['receiver_id']
        amount = float(settle['amount'])

        balances[sender_id]+=amount
        balances[receiver_id]-=amount

    return [{"user_id": uid,  "username": members_map.get(uid, "Unknown"), "net": round(v, 2)} for uid, v in balances.items()]




