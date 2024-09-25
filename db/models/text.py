"""
Module: Text Model
This module defines the Text model which represents text documents in the database. 
It includes methods for converting the Text object to a dictionary representation 
and string representation of the object.

Dependencies:
- SQLAlchemy: ORM for database interactions.
- Datetime: For managing timestamps.
- Hashlib: For generating secure hashes.
"""

from db import db
from .base import Base
from .user import User
from .file import File
from datetime import datetime
from hashlib import sha256


class Text(Base):
    __tablename__ = 'text'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    file_type = db.Column(db.String(20), nullable=False)
    hash = db.Column(db.String(64), unique=True, nullable=False)
    owner_id = db.Column(db.String(36), db.ForeignKey(User.id), nullable=False)
    file_id = db.Column(db.Integer, db.ForeignKey(File.id), nullable=True)
    private = db.Column(db.Boolean, default=True)
    shared_with_key = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, content, file_type, owner_id, private=True, shared_with_key=None):
        """
        Initialize a new Text instance.

        Parameters:
        - content (str): The text content of the document.
        - file_type (str): The type of the file (e.g., 'plain', 'markdown').
        - owner_id (str): The ID of the user who owns this text.
        - private (bool): Whether the text is private (defaults to True).
        - shared_with_key (str): Optional; key for sharing the text.
        """
        self.content = content
        self.file_type = file_type
        self.owner_id = owner_id
        self.private = private
        self.shared_with_key = shared_with_key
        self.hash = self.generate_hash(content)

    @staticmethod
    def generate_hash(content):
        """
        Generate a SHA256 hash of the content.

        Parameters:
        - content (str): The content to hash.

        Returns:
        - str: The SHA256 hash of the content.
        """
        return sha256(content.encode()).hexdigest()

    def to_dict(self):
        """
        Convert the Text object to a dictionary representation.

        Returns:
        - dict: Dictionary containing Text attributes.
        """
        return {
            'id': self.id,
            'content': self.content,
            'owner_id': self.owner_id,
            'file_type': self.file_type,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at),
            'private': self.private,
            'hash': self.hash
        }

    def __repr__(self):
        """
        Return a string representation of the Text object.

        Returns:
        - str: String representation of the Text instance.
        """
        return f'<Text {self.id} - {self.file_type}>'
