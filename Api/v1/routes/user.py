"""
Module: user_bp
This module provides user-related functionalities for authentication and user 
information retrieval via a Flask blueprint. It supports user registration, 
user profile retrieval, and user statistics.
"""

import re
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db.models.user import User
from db.models.file import File
from db.models.text import Text
from db import db
from flask_jwt_extended import create_access_token, set_access_cookies, unset_access_cookies
from ..utils.required import token_required

# Define the Blueprint for user-related routes
user_bp = Blueprint('user', __name__)


@user_bp.route('/signup', methods=['POST'])
def signup():
    """
    Register a new user.

    Request Body:
    - username (str): The username of the new user.
    - password (str): The password for the new user.
    - email (str): The email address of the new user.

    Returns:
    - JSON response indicating the status of the operation:
        - 200 if user is created successfully.
        - 400 if input validation fails (missing data, invalid email, or user already exists).
    """
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    data = request.get_json()
    msg = {"message": "", "valid": False}

    # Validate the input data
    if not data or not data.get('username') or not data.get('password') or not data.get('email'):
        msg.update({'message': 'Missing data'})
        return jsonify(msg), 400

    username = data['username']
    password = data['password']
    email = data['email']

    # Validate email format
    if not (re.fullmatch(regex, email)):
        msg.update({'message': 'Invalid Email'})
        return jsonify(msg), 400

    # Check if the user already exists
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        msg.update({'message': 'User already exists'})
        return jsonify(msg), 400

    # Hash the password and create a new user
    hashed_password = generate_password_hash(password, method='scrypt')
    new_user = User(username=username, password=hashed_password, email=email)

    # Add the user to the database
    db.session.add(new_user)
    db.session.commit()

    # Create a JWT token for the user
    token = create_access_token(identity=new_user.id)
    msg.update({"message": "User created successfully",
               "valid": True, "token": token})
    response = jsonify(msg)
    set_access_cookies(response, token)

    return response, 200


@user_bp.route('/user', methods=['GET'])
@token_required
def get_user(current_user):
    """
    Retrieve the current user's profile information.

    Parameters:
    - current_user: The authenticated user making the request.

    Returns:
    - JSON response containing user information:
        - 200 on success.
    """
    msg = {"message": "", "valid": False}
    user: User = User.query.get(current_user.id)
    msg.update({'user': user.to_dict(),
               "message": "<user [dict]>", "valid": True})

    return jsonify(msg), 200


@user_bp.route('/user/stats', methods=['GET'])
@token_required
def get_user_stats(current_user):
    """
    Retrieve statistics about the current user's files and texts.

    Parameters:
    - current_user: The authenticated user making the request.

    Returns:
    - JSON response containing statistics:
        - file_type_count (dict): Count of each file type owned by the user.
        - text_type_count (dict): Count of each text type owned by the user.
        - total_files (int): Total number of files owned by the user.
        - total_texts (int): Total number of texts owned by the user.
    """
    # Get files and texts for the current user
    files = File.query.filter_by(owner_id=current_user.id).all()
    texts = Text.query.filter_by(owner_id=current_user.id).all()

    # Aggregate file types and counts
    file_type_count = {}
    for file in files:
        file_type = file.filename.split('.')[-1]
        file_type_count[file_type] = file_type_count.get(file_type, 0) + 1

    # Aggregate text types and counts
    text_type_count = {}
    for text in texts:
        text_type = text.file_type
        text_type_count[text_type] = text_type_count.get(text_type, 0) + 1

    # Return the aggregated data
    return jsonify({
        "file_type_count": file_type_count,
        "text_type_count": text_type_count,
        "total_files": len(files),
        "total_texts": len(texts)
    }), 200
