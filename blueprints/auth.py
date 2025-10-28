from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from services.db import supabase
from datetime import datetime
from forms.auth import SignInForm, SignUpForm

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signin', methods=['GET', 'POST'])
def signin():
    form = SignInForm()
    print("🧾 Request method:", request.method)
    print("🧾 Form validate_on_submit:", form.validate_on_submit())
    print("🧾 Form errors:", form.errors)
    if form.validate_on_submit():
        email = form.email.data.strip().lower()
        password = form.password.data
        result = supabase.table('users').select('*').eq('email', email).limit(1).execute()
        user = (result.data or [None])[0]
        if not user:
            flash('No account found with that email.', 'error')
            return redirect(url_for('auth.signin'))
        if not check_password_hash(user['password'], password):
            flash('Incorrect password.', 'error')
            return redirect(url_for('auth.signin'))
        session['user_id'] = user['id']
        session['username'] = user['username']
        flash(f"Welcome back, {user['username']}!", 'success')
        return redirect(url_for('dashboard'))
    return render_template('login.html', current_year=datetime.now().year, form=form)

@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignUpForm()
    if form.validate_on_submit():
        username = form.username.data.strip()
        email = form.email.data.strip().lower()
        confirm_email = form.confirm_email.data.strip().lower()
        password = form.password.data
        confirm_password = form.confirm_password.data
        if email != confirm_email or password != confirm_password:
            flash('Email or password confirmation does not match.', 'error')
            return redirect(url_for('auth.signup'))
        existing = supabase.table('users').select('id').eq('email', email).limit(1).execute()
        if existing.data:
            flash('Email already registered.', 'error')
            return redirect(url_for('auth.signup'))
        encrypted_password = generate_password_hash(password)
        result = supabase.table('users').insert({
            'username': username,
            'email': email,
            'password': encrypted_password
        }).execute()
        if result.data:
            flash('Account created successfully! Please sign in.', 'success')
            return redirect(url_for('auth.signin'))
        else:
            flash('Account creation failed. Please try again.', 'error')
            return redirect(url_for('auth.signup'))
    return render_template('signup.html', current_year=datetime.now().year, form=form)

@auth_bp.route("/logout")
def logout():
    session.clear()
    flash("Logged out successfully.", "info")
    return redirect(url_for("auth.signin"))
