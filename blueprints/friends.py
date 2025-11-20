from services.extension import mail, Message
from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from services.db import supabase
from services.compute_total_balance_between_two import compute_total_balance_between_two
from services.login_required import login_required
 
 
friends_bp = Blueprint('friends', __name__, url_prefix='/friends')
 
@friends_bp.route('/invite',methods=['GET','POST'])
def invite_friend():
    user_id = session.get('user_id')
    friend_email = request.form.get('email','').strip().lower()
    supabase.table('friends').insert({
        'user_id': user_id,
        'friend_email': friend_email,
        'status': 'pending'
    }).execute()
    token = friend_email.replace('@','_')
    link = url_for('friends.accept_invite',token = token,_external=True)
    msg = Message(
        subject="Friend Invitation on SplitWisely",
        recipients=[friend_email],
        body=f"You have been invited to connect on SplitWisely.\nClick to accept: {link}"
    )
    print("SENDING MAIL TO:", friend_email)
 
    mail.send(msg)
    flash("Invitation sent!", "success")
    return redirect(url_for("friends.list_friends"))
 
@friends_bp.route('/accept/<token>')
def accept_invite(token):
 
    invited_email = token.replace('_','@')
 
   
    if "user_id" in session:
        user_res = supabase.table("users").select("email").eq("id", session["user_id"]).single().execute()
        logged_in_email = user_res.data["email"]
 
        if logged_in_email != invited_email:
            session.clear()  
 
   
    current_user = session.get('user_id')
    if not current_user:
        session['pending_invite'] = token
        return redirect(url_for('auth.signin'))
 
   
    user_res = supabase.table("users").select("email").eq("id", current_user).single().execute()
    logged_in_email = user_res.data["email"]
 
   
 
   
    req = supabase.table('friends').select('*').eq('friend_email', invited_email).eq('status','pending').single().execute()
 
    if not req.data:
        flash("No pending invitation found.", "error")
        return redirect(url_for('dashboard'))
 
    invitation = req.data
 
    supabase.table("friends").update({
        "friend_id": current_user,
        "status": "accepted"
    }).eq("id", invitation["id"]).execute()
 
    flash("Invitation accepted!", "success")
    return redirect(url_for("friends.list_friends"))
 
 
 
@friends_bp.route('/')
def list_friends():
    user_id = session.get('user_id')
    res = supabase.table("friends")\
        .select("id,user_id,friend_id,friend_email,status")\
        .or_(f"user_id.eq.{user_id},friend_id.eq.{user_id}")\
        .eq("status", "accepted")\
        .execute()
           
               
 
    friends = res.data or []
    friend_list = []
    for f in friends:
        partner_id = f["friend_id"] if f["user_id"] == user_id else f["user_id"]
        if partner_id == user_id:
            continue
 
        user_res = supabase.table("users").select("username, email").eq("id", partner_id).single().execute()
 
        if not user_res.data:
            continue
 
        username = user_res.data["username"]
        email = user_res.data["email"]
 
        # compute kraga balance between two users
        balance = compute_total_balance_between_two(user_id, partner_id)
 
        friend_list.append({
            "id": partner_id,
            "username": username,
            'email': email,
            "balance": balance
        })
 
    return render_template("friends.html", friends=friend_list)
 
@friends_bp.route("/remind/<friend_id>")
@login_required
def send_reminder(friend_id):
    user_id = session["user_id"]
 
    # friend ki email
    email_res = supabase.table("users").select("email,username").eq("id", friend_id).execute()
    if not email_res.data:
        flash("User not found", "error")
        return redirect(url_for("friends.list_friends"))
 
    email = email_res.data[0]["email"]
    friend_name = email_res.data[0]["username"]
 
    # compute kraga how much the friends owe me
    amount = compute_total_balance_between_two(user_id, friend_id)
 
    msg = Message(
        subject="Payment Reminder - SplitWisely",
        recipients=[email],
        body=f"Hi {friend_name},\n\nYou owe ${amount}.\nPlease settle up in SplitWisely."
    )
    mail.send(msg)
 
    flash("Reminder sent!", "success")
    return redirect(url_for("friends.list_friends"))