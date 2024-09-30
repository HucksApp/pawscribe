from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError, JWTExtendedException
from flask import jsonify
from db.models.user import User
from jwt import ExpiredSignatureError  # Ensure you import the jwt module


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
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            if not current_user:
                raise NoAuthorizationError("User not found!")
            return f(current_user, *args, **kwargs)
        except ExpiredSignatureError as e:
            return
        except Exception as e:
            raise JWTExtendedException(str(e))
    # to avoid wrapper function blocking access to <f>
    wraps.__name__ = f.__name__
    return decorated
