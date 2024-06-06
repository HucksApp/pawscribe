import os
from flask import Flask, request
from flask_cors import CORS
from Api.config.config import Config
from flask_jwt_extended import JWTManager,create_access_token, set_access_cookies, get_jwt, get_jwt_identity
from flask_socketio import SocketIO
from  db import db
from datetime import datetime
from datetime import timedelta
from datetime import timezone

# Initialize Flask application
db_instance_path = (os.getcwd()) + '/db/DB_INSTANCE'
app = Flask(__name__, instance_path=db_instance_path)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
CORS(app, resources={r"/*": {"origins": "*"}})
JWTManager(app)
socketio = SocketIO(app, async_mode='eventlet',cors_allowed_origins="*")


#SocketIO event handlers
@socketio.on('connect')
def handle_connect():
    print('Client connected -> [id]: {}'.format(request.sid))

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=90))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response



# Default route for health check
@app.route('/')
def index():
    return 'Welcome to Pawscribe API!'


# Create database models if they don't exist
with app.app_context():
    db.create_all()

#if __name__ == "__main__":
#    socketio.run(app, debug=True)
#    app.run(debug=True)

