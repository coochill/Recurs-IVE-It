import os
import firebase_admin
from firebase_admin import credentials, firestore


# Path to your service account key
service_account_key_path = os.path.join(os.path.dirname(__file__), '..', '..', 'config', 'firebaseConfig.json')


# Initialize the Firebase Admin SDK
try:
    cred = credentials.Certificate(service_account_key_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"An error occurred during Firebase initialization: {e}")