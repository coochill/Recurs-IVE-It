from firebase_admin import firestore
from flask import jsonify

db = firestore.client()

def store_user_id(user_id):
    """
    Stores the user ID in the Firestore collection 'user_sessions'
    with the 'logged_in' field set to True.
    Includes input validation and error handling.
    """
    if not user_id:
        return {'error': 'Missing userId'}, 400  

    try:
        # Reference to the Firestore document
        user_sessions_ref = db.collection('user_sessions').document(user_id)

        # Check if the document exists to prevent overwriting
        if user_sessions_ref.get().exists:
            user_sessions_ref.set({'logged_in': True}, merge=True)  
        else:
            user_sessions_ref.set({'logged_in': True})  

        return {'message': f'User {user_id} stored successfully'}, 200  
    except firestore.FirestoreError as fe:
        print(f"Firestore error: {fe}")
        return {'error': 'Firestore error occurred'}, 500  
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {'error': 'Internal server error occurred'}, 500  



def validate_user(user_id):
    """
    Validates if a user is logged in by checking the Firestore collection 'user_sessions'.
    Includes input validation and detailed error handling.
    """
    if not user_id:
        return jsonify({'valid': False, 'message': 'Missing userId'}), 400

    try:
        # Reference to the Firestore document
        user_ref = db.collection('user_sessions').document(user_id)

        # Fetch the document
        user_doc = user_ref.get()

        if user_doc.exists:
            # Check if the 'logged_in' field is True
            user_data = user_doc.to_dict()
            if user_data.get('logged_in', False):
                return jsonify({'valid': True}), 200
            else:
                return jsonify({'valid': False, 'message': 'User is not logged in'}), 200
        else:
            return jsonify({'valid': False, 'message': 'User not found'}), 404
    except firestore.FirestoreError as fe:
        print(f"Firestore error: {fe}")
        return jsonify({'valid': False, 'message': 'Firestore error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'valid': False, 'message': 'Internal server error occurred'}), 500
    
def log_out_user(user_id):
    try:

        user_ref = db.collection('user_sessions').document(user_id).get()
        # Query the database for the user document with the matching user_id
        if user_ref.exists:
         
            db.collection('user_sessions').document(user_id).update({
                'logged_in': False
            })
         
            return jsonify({'message': 'User logged out successfully'}), 200
        else:
          
            return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        
        print(f"Error logging out user: {e}")
        return jsonify({'message': 'Error logging out user', 'error': str(e)}), 500

def check_email_exists_in_db(email):
    try:
        # Query Firestore to check if the email exists in the users collection
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email).limit(1)
        results = query.stream()

        # Check if any matching user is found
        user = next(results, None)
        if user:
            return user.id 
        else:
            return None 

    except Exception as e:
        raise Exception(f"Error checking email: {str(e)}")