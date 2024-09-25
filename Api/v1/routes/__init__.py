"""
Clean up procedures related to application routes and container management upon app termination or client disconnect.

- This module manages socket connection events, container cleanup, and ensures graceful shutdown of resources when the app is terminated or reloaded.
"""

from flask import Blueprint, request, jsonify, send_file
from flask_socketio import emit
from db.models.file import File
from db.models.text import Text
from db.models.folder import Folder
from db.models.folderfxs import FolderFxS
from Api.__init__ import db, socketio
import atexit
import signal
from ..store.manager import container_manager


@socketio.on('connect')
def handle_connect():
    """
    Handles client connections to the SocketIO server.

    - When a client connects, this event is triggered.
    - The client's session ID (request.sid) is logged for tracking purposes.
    """
    print('Client connected -> [id]: {}'.format(request.sid))


def cleanup_on_exit():
    """
    Cleanup function for container management upon application exit.

    - This function is registered with atexit to ensure that containers managed by the app are cleaned up properly when the application exits.
    - Ensures that no containers are left running when the app is terminated.
    """
    container_manager.cleanup_containers()
    print("App cleanup completed.")


def handle_signal(signal, frame):
    """
    Handle system termination signals (SIGINT, SIGTERM) for graceful cleanup.

    - When a termination signal is received, this function ensures that all containers are cleaned up, and the SocketIO server is properly stopped.
    - Terminates the app gracefully to avoid resource leakage.

    Args:
        signal (int): The signal number (e.g., SIGINT or SIGTERM).
        frame (frame): The current stack frame when the signal was received.
    """
    print(f"Signal {signal} received, cleaning up...")
    container_manager.cleanup_containers()
    socketio.stop()  # Stop the socketio server if necessary
    exit(0)


# Register signal handlers to handle app reload or termination signals.
# When SIGINT or SIGTERM signals are received, the handle_signal function is called.
signal.signal(signal.SIGINT, handle_signal)
signal.signal(signal.SIGTERM, handle_signal)

# Register the cleanup_on_exit function to ensure proper cleanup when the app exits normally.
atexit.register(cleanup_on_exit)
