from functools import wraps
from flask import flash,redirect,url_for,session
def login_required(view):
    @wraps(view)
    def wrapped(*args,**kwargs):
        if 'user_id' not in session:
            flash('Please sign in to access this page', 'error')
            return redirect(url_for('auth.signin'))
        return view(*args,**kwargs)
    return wrapped