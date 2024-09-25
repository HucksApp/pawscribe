"""
Module: Flask Blueprint Registration

This module sets up the version 1 (v1) API of the application by registering
various blueprints for handling different routes. Each blueprint corresponds 
to a specific feature of the application, facilitating modular development 
and organization.

Blueprints Registered:
- auth_bp: Authentication routes.
- user_bp: User-related routes.
- files_bp: File management routes.
- text_bp: Text handling routes.
- folders_bp: Folder management routes.
- run_bp: Execution or operational routes.

Usage:
This module should be imported into the main application factory to include 
the v1 routes in the Flask app.
"""

from .routes.run import run_bp
from .routes.folder import folders_bp
from .routes.text import text_bp
from .routes.files import files_bp
from .routes.user import user_bp
from .routes.auth import auth_bp
from flask import Blueprint

# Create a Blueprint for version 1 of the API
app = Blueprint('v1', __name__)

# Import and register blueprints for various functionalities

# Register each blueprint with the main v1 Blueprint
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(files_bp)
app.register_blueprint(text_bp)
app.register_blueprint(folders_bp)
app.register_blueprint(run_bp)
