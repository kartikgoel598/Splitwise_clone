from services.compute_group_balances import compute_group_balances
from services.db import supabase
 
 
def compute_total_balance_between_two(user_a, user_b):
    total = 0.0
    mutual_groups_res = supabase.table('group_members').select('group_id').in_('user_id',[user_a,user_b]).execute()
    group_counts = {}
    for row in mutual_groups_res.data or []:
        gid = row['group_id']
        group_counts[gid] = group_counts.get(gid,0)+1
   
    shared_groups = [gid for gid in group_counts if group_counts[gid]==2]
    for gid in shared_groups:
        group_blanaces = compute_group_balances(gid)
        a_balances = next((b for b in group_blanaces if b['user_id']==user_a),None)
        b_balances = next((b for b in group_blanaces if b['user_id']==user_b),None)
        if not a_balances or not b_balances:
            continue
        if b_balances['net']<0:
            num_members = len(group_blanaces)
            share = abs(b_balances["net"]) / num_members
            total += share
        elif a_balances['net']<0:
            num_members = len(group_blanaces)
            share = abs(a_balances["net"]) / num_members
            total -= share
 
 
 
    groups_res = supabase.rpc("find_mutual_groups", {
        "user1": user_a,
        "user2": user_b
    }).execute()
 
    for g in groups_res.data:
        balances = compute_group_balances(g["group_id"])
        for b in balances:
            if b["user_id"] == user_a:
                total += b["net"]
 
    return round(total, 2)