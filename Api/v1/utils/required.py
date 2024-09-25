from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError, JWTExtendedException
from flask import jsonify
from db.models.user import User
import jwt  # Ensure you import the jwt module


def token_required(f):
    """
    Decorator to enforce JWT authentication on Flask route functions.

    It verifies the presence and validity of the JWT token in the 
    request's Authorization header. If the token is valid and the 
    user exists, the decorated function is called with the current 
    user object.

    Parameters:
    - f (function): The Flask route function to protect.

    Returns:
    - function: The wrapped function that enforces JWT authentication.

    Raises:
    - JWTExtendedException: If there is an issue with token verification or user retrieval.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            # Verify the JWT in the request
            verify_jwt_in_request()

            # Get the identity of the current user
            current_user_id = get_jwt_identity()

            # Fetch the user from the database
            current_user = User.query.get(current_user_id)
            if not current_user:
                raise NoAuthorizationError("User not found!")

            # Call the original function with the current user
            return f(current_user, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            # Handle token expiration
            return jsonify({"msg": "Token has expired. Please log in again."}), 401
        except Exception as e:
            # Handle other exceptions
            return jsonify({"msg": str(e)}), 401

    return decorated
