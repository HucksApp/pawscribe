"""Auth Routes"""
import datetime
from flask import Blueprint, request, jsonify
from db.models.user import User
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies
from ..utils.required import token_required
from ..store.manager import container_manager

# Blueprint for authentication-related routes
auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login route that verifies credentials and generates a JWT access token.

    - Expects JSON payload with 'username' and 'password'.
    - If valid credentials are provided, a JWT token is generated and set in cookies.
    - Returns a success message, the token, and user details if successful.
    - Returns an error message if credentials are invalid.

    :return: JSON response containing the token and user information or an error message.
    """
    msg = {'message': "", "valid": False}  # Default response message
    data = request.get_json()  # Retrieve JSON data from the request body
    username = data.get('username')  # Extract username
    password = data.get('password')  # Extract password
    # Query the database for the user
    user: User = User.query.filter_by(username=username).first()

    # Check if user exists and the password is correct
    if user and user.check_password(password):
        # Create JWT token with a 60-minute expiration time
        token = create_access_token(
            identity=user.id,
            fresh=datetime.timedelta(minutes=60)
        )
        # Update the response message with success details
        msg.update({"message": "Logged in successfully",
                    "valid": True, "token": token, 'user': user.to_dict()})
        response = jsonify(msg)
        # Set the token in the response cookies
        set_access_cookies(response, token)
        return response, 200  # Return success response

    # If credentials are invalid, return an error message
    msg.update({'message': "Invalid credentials"})
    return jsonify(msg), 401  # Return error response


@auth_bp.route('/logout', methods=['POST', 'GET'])
@token_required
def logout(current_user):

    """
    User logout route that clears the JWT token from cookies.

    - This route can handle both POST and GET requests.
    - Unsets the JWT token by clearing cookies.
    - Returns a success message indicating the user has been logged out.

    :return: JSON response confirming the user has been logged out.
    """
    response = jsonify({"message": "Logged out successfully", "valid": True})

    unset_jwt_cookies(response)  # Clear the JWT token from cookies
    container_manager.cleanup_existing_docker_containers(current_user.id) 
    return response, 200  # Return success response
