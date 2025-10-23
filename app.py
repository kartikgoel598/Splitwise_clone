from flask import Flask, render_template, request, redirect, url_for,session,flash
from datetime import datetime
from services.db import supabase
import os 
from blueprints.auth import auth_bp
from services.login_required import login_required
from flask_wtf import CSRFProtect



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

app.register_blueprint(auth_bp )

if __name__ == '__main__':
    app.run(debug=True)
