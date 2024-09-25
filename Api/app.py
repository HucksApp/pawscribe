"""
This module is responsible for starting the Flask application with SocketIO support.
It registers the version 1 (v1) API blueprint and runs the app.
"""
from . import app, socketio

# Adding v1 Blueprint
from Api.v1 import app as v1_app
app.register_blueprint(v1_app, url_prefix='/Api/v1')

# Main entry point for running the application with WebSocket (SocketIO) support
if __name__ == "__main__":
    socketio.run(app, debug=True)
#    app.run(debug=True)
