from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, decode_token
from flask_jwt_extended.exceptions import NoAuthorizationError, JWTExtendedException
from flask_socketio import emit
from flask import jsonify, request
from db.models.user import User

"""
headers:  Authorization: 
            Bearer <token>' 
"""

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        #try:
        #msg = {"message":"", "valid":False}
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if not current_user:
            raise NoAuthorizationError("User not found!")
        return f(current_user, *args, **kwargs)
        #except Exception as e:
        #   raise JWTExtendedException(str(e))
    # to avoid wrapper function blocking access to <f>
    wraps.__name__ = f.__name__
    return decorated
