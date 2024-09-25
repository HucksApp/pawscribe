"""
Module: Application Entry Point
This module serves as the main entry point for the Flask application.
It initializes the app and sets up the WebSocket connections using SocketIO.

Dependencies:
- app: The Flask application instance from the Api module.
- socketio: The SocketIO server instance for handling real-time communications.
- Api_urls: A function to show  Accesible routes.

Usage:
This module should be run as the main program to start the Flask application
and enable real-time data communication through SocketIO, data exchange through Rest Api
"""

from Api.app import app, socketio            # Import the Flask app and SocketIO instance
from Api.debug import Api_urls
import os
if __name__ == "__main__":
    if os.getenv("APP_INSTANCE") == "dev":
        Api_urls(app)
    # Run the Flask app with SocketIO support
    socketio.run(app, host='0.0.0.0', port=8000, debug=True)
