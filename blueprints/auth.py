from flask import Blueprint, render_template, request, redirect, url_for, session, flash, request
from werkzeug.security import generate_password_hash, check_password_hash
from services.db import supabase
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        email = request.form.get('email',' ')
        password = request.form.get('password', " ")
        user_data = supabase.table('users').select('*').eq("email",email).limit(1).execute()
        user = (user_data.data or [None])[0]
        if not user:
            flash('No account with that email',"error")
            return redirect(url_for('auth.signin'))
        if not check_password_hash(user['password'],password):
            flash('Incorrect password', "error")
            return redirect(url_for('auth.signin'))
        session['user_id']= user['id']
        session['username'] = user['username']
        flash(f"welcome back, {user['username']}!",'success')
        page_to_redirect_to = request.args.get('next') or url_for('dashboard')
        return redirect(page_to_redirect_to)

    
    
    return render_template('signin.html', current_year=datetime.now().year)

@auth_bp.route('/signup', methods=['GET','POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email',"").strip().lower()
        password= request.form.get('password',"")
        username = request.form.get('username',"").strip()
        if not username or not email or not password:
            flash('all fields are required')
            return redirect(url_for('auth.signup'))
        existing = supabase.table('users').select('id').eq('email',email).limit(1).execute()
        if existing.data:
            flash('email already registered')
            return redirect(url_for('auth.signup'))
        encrypted_password = generate_password_hash(password)
        result = supabase.table('users').insert({
            'username':username,
            'email':email,
            'password':encrypted_password
        }).execute()
        if result.data:
            session['user']=result.data[0]
            flash('account cretaed successfully')
            return redirect(url_for('dashboard'))
        else:
            flash('account creation failed')
            return redirect(url_for('auth.signup'))
        
    return render_template('signup.html', current_year=datetime.now().year)

@auth_bp.route("/logout")
def logout():
    session.clear()
    flash("Logged out successfully.", "info")
    return redirect(url_for("auth.signin"))