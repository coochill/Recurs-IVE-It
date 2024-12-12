import re
from firebase_admin import auth
from services.firestore_connection import db

def validate_email(email):
    """Validate the email format."""
    email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
    return re.match(email_regex, email) is not None

def validate_password(password):
    """Validate the password according to the given rules."""
    password_regex = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{6,}$"

    return re.match(password_regex, password) is not None

def sign_up_user(username, email, password):
    if not username or not email or not password:
        return {"error": "Username, email, and password are required"}, 400

    if not validate_email(email):
        return {"error": "Invalid email format"}, 400

    if not validate_password(password):
        return {
            "error": "Password must be at least 6 characters long, include uppercase, lowercase, a number, and a special character"
        }, 400

    try:
        # Check if username already exists in Firestore
        user_doc_ref = db.collection('users').document(username)
        if user_doc_ref.get().exists:
            return {"error": "Username already exists"}, 400

        user = auth.create_user(email=email, password=password)

        # Add user to Firestore in 'users' collection
        user_doc_ref.set({
            'username': username,
            'email': email
        })

        return {"message": "User created successfully", "uid": user.uid}, 201

    except auth.EmailAlreadyExistsError:
        return {"error": "Email is already in use"}, 400
    except Exception as e:
        print(f"Error during user signup: {str(e)}")
        return {"error": "An error occurred during sign-up. Please try again."}, 500
