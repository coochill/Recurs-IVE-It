from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.exceptions import TooManyRequests
from flask_cors import CORS
from services.firestore_fetch import fetch_algorithm_names, fetch_algorithm_details, fetch_color_guide_details
from algorithms.fibonacci import fibonacci_tree
from algorithms.factorial import factorial_tree
from algorithms.mergesortanalysis import merge_sort_tree
from algorithms.quicksortanalysis import quicksort_tree
from algorithms.catalan import catalan_tree
from algorithms.randomquicksortanalysis import randomized_quick_sort_tree
from authentication.signup import sign_up_user
from authentication.login import login_user, verify_email_for_password_reset
from authentication.user_sessions import store_user_id, validate_user, log_out_user, check_email_exists_in_db
import logging
import os

from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
CORS(app)  

# Initialize the Limiter with default limits
limiter = Limiter(
    key_func=get_remote_address, 
    default_limits=["20 per minute"] 
)

# Apply the limiter to the whole app
limiter.init_app(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the ThreadPoolExecutor
executor = ThreadPoolExecutor(max_workers=5)

# Custom error handling for rate limit exceeded
@app.errorhandler(TooManyRequests)
def handle_rate_limit_error(e):
    logger.warning(f"Rate limit exceeded: {e}")
    return jsonify({"error": "Too many requests. Please try again later."}), 429

def log_and_respond_error(error_message, status_code):
    logger.error(error_message)
    return jsonify({"error": error_message}), status_code

@app.route('/get-algorithms', methods=['GET'])
def get_algorithms():
    """Fetch all algorithms concurrently."""
    try:
        future = executor.submit(fetch_algorithm_names)
        algorithm_list = future.result()  
        return jsonify(algorithm_list), 200
    except Exception as e:
        return log_and_respond_error(f"Error fetching algorithm names: {str(e)}", 500)

@app.route('/get-color-guide', methods=['GET'])
def fetch_color_guide():
    """Fetch color guide details via Firestore fetch function."""
    try:
        future = executor.submit(fetch_color_guide_details)
        field_values = future.result() 

        if field_values:
            return jsonify({"field_values": field_values}), 200
        else:
            return log_and_respond_error(
                "The 'guide_1' document does not exist in the 'color_guides' collection.", 404
            )
    except Exception as e:
        return log_and_respond_error(f"Error fetching color guide: {str(e)}", 500)

@app.route('/get-algorithm-code', methods=['POST'])
def get_algorithm_code():
    """Fetch details of a specific algorithm concurrently."""
    data = request.get_json()
    algorithm_id = data.get("id")

    if not algorithm_id:
        return log_and_respond_error("Algorithm ID is required", 400)

    try:
        future = executor.submit(fetch_algorithm_details, algorithm_id)
        details = future.result()  
        if details:
            print ("okay", details)
            return jsonify(details), 200
        else:
            return log_and_respond_error("Algorithm not found", 404)
    except Exception as e:
        return log_and_respond_error(f"Error fetching algorithm details: {str(e)}", 500)

# Helper function to process algorithm requests
def process_algorithm(algorithm_func, n, algorithm_name):
    print(algorithm_name)
    print(algorithm_func)
    if not isinstance(n, int) or n < 0:
        return log_and_respond_error(f"Invalid parameter for {algorithm_name}", 400)

    try:
        result_data = algorithm_func(n)
        response_data = {
            "status": "success",
            "algorithm_name": algorithm_name,  
            "result": result_data['tree'],
            "total_base_cases": result_data.get('total_base_cases', 0),
            "total_repeated_subproblems": result_data.get('total_repeated_subproblems', 0),
            "total_nodes": result_data['total_nodes']
        }
        return jsonify(response_data), 200
    except ValueError:
        return log_and_respond_error(f"Invalid parameter: 'n' must be a non-negative integer.", 400)
    except TypeError as e:
        return log_and_respond_error(f"Unexpected error: {str(e)}", 400)
    except Exception as e:
        return log_and_respond_error(f"An error occurred during algorithm execution: {str(e)}", 500)

@app.route('/run-algorithm', methods=['POST'])
@limiter.limit("30 per minute") 
def run_algorithm():
    """Run the specified algorithm with provided parameters."""
    data = request.json
    algorithm_id = data.get('algorithm')
    parameters = data.get('parameters')
    n = parameters.get('n')

    algorithms = {
        "fibonacci": fibonacci_tree,
        "factorial": factorial_tree,
        "merge_sort_analysis": merge_sort_tree,
        "nonrandom_quick_sort_analysis": quicksort_tree,
        "catalan": catalan_tree,
        "random_quick_sort_analysis": randomized_quick_sort_tree
    }

    if algorithm_id in algorithms:
        return process_algorithm(algorithms[algorithm_id], n, algorithm_id)

    return log_and_respond_error("Algorithm not found.", 404)

@app.route('/signup', methods=['POST'])
def sign_up():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    response, status_code = sign_up_user(username, email, password)
    return jsonify(response), status_code

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username_or_email = data.get('usernameOrEmail')
    password = data.get('password')

    return login_user(username_or_email, password)

@app.route('/storeUserIdUsername', methods=['POST'])
def store_userid_username():
    try:
       
        data = request.get_json()
        user_id = data.get('userId')

        if not user_id:
            raise ValueError("User ID is missing")

        
        message, status_code = store_user_id(user_id)  

        return jsonify(message), status_code  

    except ValueError as ve:
     
        logging.error(f"ValueError: {str(ve)}")
        return jsonify({'error': f"ValueError: {str(ve)}"}), 400
    except Exception as e:
       
        logging.error(f"Exception: {str(e)}")
        return jsonify({'error': f"Exception: {str(e)}"}), 500


@app.route('/validate_user', methods=['POST'])
def validate_user_route():
    try:
       
        data = request.get_json()
        user_id = data.get('userId')

    
        response, status_code = validate_user(user_id)

        print("Response:", response)
        print("Status Code:", status_code)

       
        return response, status_code

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"valid": False, "message": "Internal server error"}), 500

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    try:
        response = verify_email_for_password_reset(email)
        return response
    except Exception as e:
        return log_and_respond_error(f"Error verifying email for password reset: {str(e)}", 500)
    
@app.route('/logout', methods=['POST'])
def logout():
    data = request.get_json() 
    user_id = data.get('userId')  
    
    if not user_id:
     
        return jsonify({'message': 'userId is required'}), 400
    
    return log_out_user(user_id) 

@app.route('/check-email', methods=['POST'])
def check_if_email_exists():
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({'message': 'Email is required'}), 400

        user_id = check_email_exists_in_db(email)

        if user_id:
            return jsonify({'userId': user_id}), 200  
        else:
            return jsonify({'message': 'Email is not registered'}), 404

    except Exception as e:
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5000, ssl_context=('cert.pem', 'key.pem'), debug=True)
