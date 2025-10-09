from services.db import supabase
from collections import defaultdict
def compute_group_balances(group_id : str):
    expenses_list = supabase.table('expenses').select('id,amount,paid_by').eq('group_id',group_id).execute()
    expenses = (expenses_list.data or [])

    expenses_id = [exp_id['id'] for exp_id in expenses]
    shares = []
    if expenses_id:
        shares_initial_list = supabase.table('expense_shares').select('expense_id,user_id,share_amount').eq('expense_id',expenses_id).execute()
        shares = (shares_initial_list.data or [])
    balances = defaultdict(lambda:0.0)
    for ex in expenses:
        balances[ex['paid_by']] += float(ex['amount'])
    for sh in shares:
        balances[sh['user_id']] -= float(sh['share_amount'])
    return [{"user_id": uid, "net": round(v, 2)} for uid, v in balances.items()]




