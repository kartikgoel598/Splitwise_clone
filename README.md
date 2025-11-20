
#Splitwisely – Group Expense Sharing App

This is a simple Splitwise-style web app built with Flask, Supabase, HTML/CSS, and JavaScript. Users can create groups, add expenses, split bills, and track who owes who.

Setup Instructions
1. Clone the project
git clone https://github.com/your-username/Splitwisely.git
cd Splitwisely

2. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate

3. Install dependencies
pip install -r requirements.txt

4. Add your environment variables

Create a .env file with:

SUPABASE_URL=
SUPABASE_ANON_KEY=
FLASK_SECRET_KEY=
PAYPAL_CLIENT_ID = 
PAYPAL_SECRET_KEY = 
PAYPAL_URL = 
EMAIL_PASSWORD =
EMAIL_USER =

5. Run the app
python app.py
