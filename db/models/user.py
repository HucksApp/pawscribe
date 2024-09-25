"""
Module: User Model
This module defines the User model which represents users in the database. 
It includes methods for password hashing and verification, and user-related 
relationships with other entities.

Dependencies:
- SQLAlchemy: ORM for database interactions.
- os: To access environment variables.
- UUID: For generating unique user IDs.
- Flask-Login: To manage user sessions.
- Werkzeug: For securely hashing passwords.
"""

from db import db
import os
from werkzeug.security import generate_password_hash, check_password_hash
from .base import Base
import uuid


class User(Base):
    __tablename__ = 'user'

    id = db.Column(db.String(36), primary_key=True,
                   default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    # Establishing relationships with other models
    if os.getenv("DB_TYPE") == 'mysql':
        files = db.relationship('File', backref='owner',
                                lazy=True, cascade='delete')
        texts = db.relationship('Text', backref='owner',
                                lazy=True, cascade='delete')
        folders = db.relationship(
            'Folder', backref='owner', lazy=True, cascade='delete')
        folderfx = db.relationship(
            'FolderFxS', backref='owner', lazy=True, cascade='delete')

    def set_password(self, password):
        """
        Hash the password and set it for the user.

        Parameters:
        - password (str): The password to hash.
        """
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """
        Check a plain password against the hashed password.

        Parameters:
        - password (str): The plain password to check.

        Returns:
        - bool: True if the password matches, False otherwise.
        """
        return check_password_hash(self.password, password)

    def to_dict(self):
        """
        Convert the User object to a dictionary representation.

        Returns:
        - dict: Dictionary containing User attributes.
        """
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username
        }

    def __repr__(self):
        """
        Return a string representation of the User object.

        Returns:
        - str: String representation of the User instance.
        """
        return f'<User {self.username}>'
