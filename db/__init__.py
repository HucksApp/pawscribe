"""
Module: Database Initialization
This module initializes the SQLAlchemy instance for the Flask application, enabling 
database interactions through an ORM layer.

Dependencies:
- Flask-SQLAlchemy: An extension that simplifies SQLAlchemy integration with Flask.
"""

from flask_sqlalchemy import SQLAlchemy

# Create an instance of SQLAlchemy
db = SQLAlchemy()
