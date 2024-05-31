from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_socketio import SocketIO
from Api.config.config import Config
from db import db

# Initialize the Flask application
app = Flask(__name__)
app.config.from_object(Config)

# Initialize database
db = db.init_app(app)

# Initialize login manager
login_manager = LoginManager(app)
login_manager.login_view = 'auth.login'

# Initialize SocketIO
socketio = SocketIO(app, async_mode='eventlet')

# Import and register blueprints
from Api.v1.routes.auth import auth as auth_blueprint
from Api.v1.routes.files import files as files_blueprint
from Api.v1.routes.user import user_bp 

app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(files_blueprint, url_prefix='/files')
app.register_blueprint(user_bp, url_prefix='/user')

# Create database models if they don't exist
with app.app_context():
    db.create_all()

# Handle socket.io events
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# Default route for health check
@app.route('/')
def index():
    return jsonify({"message": "Welcome to Pawscribe API!"})

if __name__ == '__main__':
    socketio.run(app, debug=True)