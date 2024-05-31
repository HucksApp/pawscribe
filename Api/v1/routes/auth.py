import jwt
import datetime
from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from db.models.user import User
#from Api.__init__ import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, set_access_cookies, unset_access_cookies
#from . import app as auth

auth_bp = Blueprint('auth', __name__)


#@login_manager.user_loader
#def load_user(user_id):
#    return User.query.get(int(user_id))

@auth_bp.route('/login', methods=['POST'])
def login():
    msg = {'message': "", "valid": False}
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        token = create_access_token(identity=user.id)
        msg.update({"message": "Logged in successfully", 
               "valid":True, "token":token})
        response = jsonify(msg)
        set_access_cookies(response, token)
        return response, 200
    msg.update({'message': "User Do Not Exist"})
    return jsonify(msg), 404
    
        


#def login():
#    data = request.get_json()
#    username = data.get('username')
#    password = data.get('password')
#    user = User.query.filter_by(username=username).first()
#    if user and user.check_password(password):
#        login_user(user)
#        return jsonify({"msg": "Logged in successfully"}), 200
#    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/logout', methods=['POST', 'GET'])
def logout():
    response = jsonify({"message": "Logged out successfully", "valid": True})
    unset_access_cookies(response)
    return response, 200