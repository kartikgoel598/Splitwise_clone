from flask import Flask, render_template, request, redirect, url_for, session, flash
from datetime import datetime
from services.db import supabase
import os 
from blueprints.auth import auth_bp
from services.login_required import login_required
from flask_wtf import CSRFProtect
from blueprints.groups import group_bp


app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', "dev-secret")
csrf = CSRFProtect(app)


@app.context_processor
def year():
    return {"current_year": datetime.utcnow().year}


@app.route("/dashboard", methods=['GET', 'POST'])
@login_required
def dashboard():
    return render_template('index.html', current_year=datetime.now().year) 


@app.route('/')
def landing():
    return render_template('landing.html', current_year=datetime.now().year)


# ===== FRIENDS PAGE ROUTE =====
@app.route("/friends")
@login_required
def friends():
    return render_template('friends.html', current_year=datetime.now().year)


# ===== ACTIVITY PAGE ROUTE =====
@app.route("/activity")
@login_required
def activity():
    return render_template('activity.html', current_year=datetime.now().year)


app.register_blueprint(auth_bp)
app.register_blueprint(group_bp)

if __name__ == '__main__':
    app.run(debug=True)