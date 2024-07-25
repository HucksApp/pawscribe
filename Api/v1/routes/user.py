import re
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db.models.user import User
from db import db
from flask_jwt_extended import create_access_token, set_access_cookies, unset_access_cookies

 

# Define the Blueprint for user-related routes
user_bp = Blueprint('user', __name__)


@user_bp.route('/signup', methods=['POST'])
def signup():
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    data = request.get_json()
    msg = {"message": "", "valid": False}
    # Validate the input data
    if not data or not data.get('username') or not data.get(
            'password') or not data.get('email'):
        msg.update({'message': 'Missing data'})
        return jsonify(msg), 400

    username = data['username']
    password = data['password']
    email = data['email']

    # validate Email
    if not (re.fullmatch(regex, email)):
        msg.update({'message': 'Invalid Email'})
        return jsonify(msg), 400

    # Check if the user already exists
    if User.query.filter_by(
            username=username).first() or User.query.filter_by(
            email=email).first():
        msg.update({'message': 'User already exists'})
        return jsonify(msg), 400
    # Hash the password
    hashed_password = generate_password_hash(password, method='scrypt')
    # Create a new user
    new_user = User(username=username, password=hashed_password, email=email)
    # Add the user to the database
    db.session.add(new_user)
    db.session.commit()
    token = create_access_token(identity=new_user.id)
    msg.update({"message": "User created successfully",
               "valid": True, "token": token})
    response = jsonify(msg)
    set_access_cookies(response, token)
    return response, 200


@user_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    msg = {"message": "", "valid": False}
    user = User.query.get(user_id)

    if not user:
        msg.update({'message': 'User not found'})
        return jsonify(msg), 404

    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,

    }
    msg.update({'user': user_data, "message": "<user [dict]>", "valid": True})
    return jsonify(msg), 200
