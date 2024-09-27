"""
Module: Folder Model
This module defines the Folder model which represents folders in the database. 
It includes methods for converting the folder object to a dictionary representation 
and string representation of the folder object.

Dependencies:
- SQLAlchemy: ORM for database interactions.
- Datetime: For managing timestamps.
"""

from db import db
from .base import Base
from .user import User
from datetime import datetime


class Folder(Base):
    __tablename__ = 'folder'

    id = db.Column(db.Integer, primary_key=True)
    foldername = db.Column(db.String(256), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(500), nullable=True)
    language = db.Column(db.String(30), nullable=True)
    owner_id = db.Column(db.String(36), db.ForeignKey(User.id), nullable=False)

    def __init__(self, foldername, owner_id, description=None, language=None):
        """
        Initialize a new Folder instance.

        Parameters:
        - foldername (str): The name of the folder.
        - description (str): A brief description of the folder (optional).
        - language (str): The language associated with the folder (optional).
        - owner_id (str): The ID of the user who owns the folder.
        """
        self.foldername = foldername
        self.owner_id = owner_id
        self.description = description
        self.language = language

    def to_dict(self):
        """
        Convert the Folder object to a dictionary representation.

        Returns:
        - dict: Dictionary containing folder attributes.
        """
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'foldername': self.foldername,
            'description': self.description,
            'language': self.language,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at),
        }

    def __repr__(self):
        """
        Return a string representation of the Folder object.

        Returns:
        - str: String representation of the Folder instance.
        """
        return f'<Folder {self.id} - {self.foldername}>'
