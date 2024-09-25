"""
This module initializes and configures a Flask web application, enabling 
CORS, JWT authentication, WebSocket communication, and database integration.
It also handles refreshing JWT tokens and includes a health check route.
"""
import os
from flask import Flask
from flask_cors import CORS
from Api.config.config import Config
from flask_jwt_extended import JWTManager, create_access_token, set_access_cookies, get_jwt, get_jwt_identity
from flask_socketio import SocketIO
from db import db
from datetime import datetime, timedelta, timezone

# Initialize Flask application with custom instance path for the database
db_instance_path = os.path.join(os.getcwd(), 'db/DB_INSTANCE')
app = Flask(__name__, instance_path=db_instance_path)
app.config.from_object(Config)

# Initialize database, CORS, JWT, and SocketIO
db.init_app(app)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes
JWTManager(app)  # Set up JWT for handling authentication
socketio = SocketIO(app, async_mode='eventlet',
                    cors_allowed_origins="*")  # WebSocket support


@app.after_request
def refresh_expiring_jwts(response):
    """
    After each request, check if the JWT is close to expiration.
    If it is, refresh the token and set new access cookies in the response.
    """
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=90))
        if target_timestamp > exp_timestamp:  # Token is expiring soon
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # If there's no valid JWT, return the original response without changes
        return response

# Health check route to verify that the API is running


@app.route('/')
def index():
    """
    Basic route for health check, returning a simple welcome message.
    """
    return 'Welcome to Pawscribe API!'


# Create database models (if they don't exist) during application startup
with app.app_context():
    db.create_all()
