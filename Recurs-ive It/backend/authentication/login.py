from firebase_admin import auth, firestore
from flask import jsonify, request
import re
import time

db = firestore.client()

# Simulated rate-limiting dictionary
rate_limiting = {}

def apply_rate_limit(ip_address):
    current_time = time.time()
    if ip_address in rate_limiting:
        last_attempt, attempts = rate_limiting[ip_address]
        if current_time - last_attempt < 60:
            if attempts >= 5:
                return False  
            rate_limiting[ip_address] = (last_attempt, attempts + 1)
        else:
            rate_limiting[ip_address] = (current_time, 1)
    else:
        rate_limiting[ip_address] = (current_time, 1)
    return True

def login_user(username_or_email, password):
    if not username_or_email or not password:
        return jsonify({"message": "Username/Email and Password are required"}), 400
    
    ip_address = request.remote_addr
    if not apply_rate_limit(ip_address):
        return jsonify({"message": "Too many login attempts. Try again later."}), 429

    # Check if username_or_email is an email
    if re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', username_or_email):
        try:
            auth.get_user_by_email(username_or_email)
            return jsonify({"message": "Email is registered"}), 200
        except auth.UserNotFoundError:
            return jsonify({"message": "Email is not registered"}), 404
        except Exception:
            return jsonify({"message": "Server error occurred"}), 500
    else:
        try:
            user_doc = db.collection('users').document(username_or_email).get()
            if user_doc.exists:
                email = user_doc.to_dict().get('email')
                return jsonify({"message": "Username is registered", "email": email}), 200
            else:
                return jsonify({"message": "Username is not registered"}), 404
        except Exception:
            return jsonify({"message": "Server error occurred"}), 500

def verify_email_for_password_reset(email):
    if not email:
        return jsonify({"message": "Email is required."}), 400
    
    ip_address = request.remote_addr
    if not apply_rate_limit(ip_address):
        return jsonify({"message": "Too many requests. Try again later."}), 429

    try:
        auth.get_user_by_email(email)
        return jsonify({"message": "Email is registered. Proceed with reset."}), 200
    except auth.UserNotFoundError:
        return jsonify({"message": "Email is not registered."}), 404
    except Exception:
        return jsonify({"message": "An error occurred while verifying email."}), 500
