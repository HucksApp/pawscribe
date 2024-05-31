import os
from flask import Flask
from flask_cors import CORS
from Api.config.config import Config
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from  db import db

# Initialize Flask application
db_instance_path = (os.getcwd()) + '/db/DB_INSTANCE'
app = Flask(__name__, instance_path=db_instance_path)
app.config.from_object(Config)


# Initialize extensions
db.init_app(app)

#CORS(app, resources={r"/*": {"origins": "http://127.0.0.1"}})
CORS(app, resources={r"/*": {"origins": "*"}})
JWTManager(app)
socketio = SocketIO(app, async_mode='eventlet',cors_allowed_origins="*")



#SocketIO event handlers
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


# Default route for health check
@app.route('/')
def index():
    return 'Welcome to Pawscribe API!'

# v1 Blueprint
#from .v1 import app as v1_app
#app.register_blueprint(v1_app, url_prefix='/Api/v1')

# Create database models if they don't exist
with app.app_context():
    db.create_all()

#if __name__ == "__main__":
#    socketio.run(app, debug=True)
#    app.run(debug=True)

