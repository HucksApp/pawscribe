"""
Module: File Model
This module defines the File model which represents files in the database. 
It includes methods for generating file hashes, converting the file object 
to a dictionary representation, and string representation of the file object.

Dependencies:
- SQLAlchemy: ORM for database interactions.
- Datetime: For managing timestamps.
- Hashlib: For hashing file data.
"""

from db import db
from .base import Base
from .user import User
from datetime import datetime
from hashlib import sha256


class File(Base):
    __tablename__ = 'file'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(256), unique=True, nullable=False)
    data = db.Column(db.LargeBinary(length=(2**32)-1), nullable=False)
    hash = db.Column(db.String(64), unique=True, nullable=False)
    owner_id = db.Column(db.String(36), db.ForeignKey(User.id), nullable=False)
    private = db.Column(db.Boolean, default=True)
    shared_with_key = db.Column(db.String(128), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, filename, owner_id, data):
        """
        Initialize a new File instance.

        Parameters:
        - filename (str): The name of the file.
        - owner_id (str): The ID of the user who owns the file.
        - data (bytes): The binary data of the file.
        """
        self.filename = filename
        self.owner_id = owner_id
        self.data = data
        self.hash = self.generate_hash(data)

    @staticmethod
    def generate_hash(data):
        """
        Generate a SHA-256 hash for the given data.

        Parameters:
        - data (bytes): The binary data to hash.

        Returns:
        - str: The hexadecimal digest of the hash.
        """
        return sha256(data).hexdigest()

    def to_dict(self):
        """
        Convert the File object to a dictionary representation.

        Returns:
        - dict: Dictionary containing file attributes.
        """
        return {
            'id': self.id,
            'filename': self.filename,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at),
            'owner_id': self.owner_id,
            'private': self.private,
            'shared_with_key': self.shared_with_key,
            'hash': self.hash
        }

    def __repr__(self):
        """
        Return a string representation of the File object.

        Returns:
        - str: String representation of the File instance.
        """
        return f'<File {self.filename}>'
