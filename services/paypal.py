import os
from dotenv import load_dotenv
import requests
import base64

load_dotenv()
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET_KEY = os.getenv('PAYPAL_SECRET_KEY')
PAYPAL_URL = os.getenv('PAYPAL_URL')
PAYPAL_CURRENCY = 'NZD'

def _access_token():
    auth = base64.b64encode(f'{PAYPAL_CLIENT_ID}:{PAYPAL_SECRET_KEY}'.encode()).decode()
    response = requests.post(
        f"{PAYPAL_URL}/v1/oauth2/token",
        headers={"Authorization": f"Basic {auth}"},
        data={"grant_type": "client_credentials"},
        timeout=20,
    )
    response.raise_for_status()
    return response.json().get("access_token")

def create_order(amount:str)->dict:
    token = _access_token()
    body = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {"currency_code": PAYPAL_CURRENCY, "value": amount}
        }],
        "application_context": {
            "shipping_preference": "NO_SHIPPING",
            "user_action": "PAY_NOW",
            "return_url": "http://127.0.0.1:5000/paypal/success",
            "cancel_url": "http://127.0.0.1:5000/paypal/cancel"
           
        }
    }
    response = requests.post(
        f'{PAYPAL_URL}/v2/checkout/orders',
        headers={
            "Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json=body,
            timeout=20
    )
    response.raise_for_status()
    return response.json()

def capture_order(order_id:str)-> dict:
    token = _access_token()
    response= requests.post(
        f'{PAYPAL_URL}/v2/checkout/orders/{order_id}/capture',
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        timeout=20,
    )
    response.raise_for_status()
    return response.json()