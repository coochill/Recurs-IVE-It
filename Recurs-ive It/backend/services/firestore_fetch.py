import logging
from firebase_admin import firestore, storage
from . import firestore_connection
import requests
from urllib.parse import urlparse
import re
import os


logging.basicConfig(level=logging.INFO)

def is_valid_algorithm_id(algorithm_id):
    """Validate the algorithm ID format. Assumes it should be a non-empty string containing only alphanumeric characters or underscores."""
    if isinstance(algorithm_id, str) and len(algorithm_id) > 0:
        return all(c.isalnum() or c == '_' for c in algorithm_id) 
    return False

def is_valid_algorithm_data(data):
    """ Validate algorithm data structure. Ensure the required fields are present and not empty. """
    required_fields = ["name", "code", "description", "parameters"]
    return all(field in data and data[field] for field in required_fields)

def fetch_algorithm_names():
    db = firestore_connection.db
    algorithms_ref = db.collection('algorithms')

    algorithms = algorithms_ref.stream()
    algorithm_list = []

    for alg in algorithms:
        algorithm_data = {
            "id": alg.id,
            "name": alg.get("name")  
        }

        if algorithm_data["name"]:  
            algorithm_list.append(algorithm_data)
        else:
            logging.warning(f"No name found for document ID {alg.id}")

    return algorithm_list

def fetch_algorithm_details(algorithm_id):
    if not is_valid_algorithm_id(algorithm_id):
        logging.error(f"Invalid algorithm ID: {algorithm_id}")
        return None

    db = firestore_connection.db
    algorithm_ref = db.collection('algorithms').document(algorithm_id)

    try:
        algorithm = algorithm_ref.get()
        if algorithm.exists:
            description_link = algorithm.get("description")  
            if not isinstance(description_link, str) or not description_link.startswith("http"):
                logging.error(f"Invalid description link for algorithm ID {algorithm_id}")
                return None

            details = {
                "code": algorithm.get("code"),
                "description": read_text_file(description_link), 
                "parameters": algorithm.get("parameters") 
            }
            print ("lalala", details)
            return details
        else:
            logging.error(f"Algorithm with ID {algorithm_id} does not exist.")
            return None
    except Exception as e:
        logging.error(f"Failed to fetch details for algorithm ID {algorithm_id}: {e}")
        return None

def fetch_color_guide_details():
    db = firestore_connection.db
    guide_ref = db.collection('color_guides').document('guide_1')

    try:
        guide = guide_ref.get()
        if guide.exists:
            guide_data = guide.to_dict()
            field_values = list(guide_data.values())
            formatted_values = "\n".join(str(value) for value in field_values)
            return formatted_values
        else:
            logging.warning("Color guide 'guide_1' not found.")
            return None
    except Exception as e:
        logging.error(f"Error fetching color guide details: {e}")
        return None

def is_valid_url(url):
    """Check if the URL is valid and points to a .txt file."""
    parsed_url = urlparse(url)
    return parsed_url.scheme in ("http", "https") and parsed_url.path.endswith(".txt")

import requests
import re
import logging

def read_text_file(link):
    if not is_valid_url(link):
        logging.warning(f"Invalid URL or file type: {link}")
        return "Invalid document link."

    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        with requests.get(link, headers=headers, timeout=5, stream=True) as response:
            response.raise_for_status()
            
            if "text" not in response.headers.get("Content-Type", ""):
                logging.error(f"URL content is not a text file: {link}")
                return "The file is not a valid text document."

            formatted_content = []
            for line in response.iter_lines(decode_unicode=True):
                # Convert bold markdown **text** to HTML <strong>text</strong>
                line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
                
                # Convert {{text}} to red-colored text using <span>
                line = re.sub(r'\{\{(.*?)\}\}', r'<span style="color: #C62E2E;">\1</span>', line)
                line = re.sub(r'\\\\(.*?)\\\\', r'<span style="color: #825B32;">\1</span>', line)
                line = re.sub(r'\@\@(.*?)\@\@', r'<span style="color: orange;">\1</span>', line)
                line = re.sub(r'\+\+(.*?)\+\+', r'<span style="color: #6EC207;">\1</span>', line)
                line = re.sub(r'\#\#(.*?)\#\#', r'<span style="color: #0D92F4;">\1</span>', line)

                
                # Replace newlines with <br/> for HTML formatting
                formatted_content.append(line.replace("\n", "<br/>"))
           
            return "<br/>".join(formatted_content)

    except requests.exceptions.Timeout:
        logging.error(f"Request to {link} timed out.")
        return "Request timed out."
    except requests.exceptions.HTTPError as err:
        logging.error(f"HTTP error while fetching {link}: {err}")
        return "Failed to retrieve description due to an HTTP error."
    except requests.exceptions.RequestException as e:
        logging.error(f"Network error while fetching {link}: {e}")
        return "Failed to retrieve description due to a network error."
