from flask import Flask, render_template, request, redirect, url_for,session,flash
from supabase import create_client, Client
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime
from dotenv import load_dotenv
import os 

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', "dev-secret")

supabase_url_key = os.getenv('SUPABASE_URL')
supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
supabase = create_client(supabase_url_key, supabase_anon_key)

@app.context_processor
def year():
    return {"current_year": datetime.utcnow().year}

def login_required(view):
    @wraps(view)
    def wrapped(*args,**kwargs):
        if 'user' not in session:
            flash('Please sign in to access this page', 'error')
            return redirect(url_for('signin'))
        return view(*args,**kwargs)
    return wrapped
@app.route("/dashboard", methods=['GET', 'POST'])
@login_required
def dashboard():
    return render_template('home.html', current_year=datetime.now().year) 
    

@app.route('/')
def home():
    return render_template('home.html', current_year=datetime.now().year)

@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        print(f"Sign in attempt - Email: {email}")
        # Add your authentication logic here
        return redirect(url_for('home'))
    
    return render_template('signin.html', current_year=datetime.now().year)

if __name__ == '__main__':
    app.run(debug=True)
