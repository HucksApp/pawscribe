"""
Module: FolderFxS Model
This module defines the FolderFxS model which represents a structure 
for organizing folders, files, and texts in the database. 
It includes methods for converting the FolderFxS object to a dictionary representation 
and string representation of the object.

Dependencies:
- SQLAlchemy: ORM for database interactions.
- Datetime: For managing timestamps.
"""

from db import db
from .base import Base
from .user import User
from .text import Text
from .file import File
from .folder import Folder
from datetime import datetime


class FolderFxS(Base):
    __tablename__ = 'folderFxS'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    text_id = db.Column(db.Integer, db.ForeignKey(Text.id), nullable=True)
    file_id = db.Column(db.Integer, db.ForeignKey(File.id), nullable=True)
    parent_id = db.Column(db.Integer, db.ForeignKey(Folder.id), nullable=False)
    folder_id = db.Column(db.Integer, db.ForeignKey(Folder.id), nullable=True)
    owner_id = db.Column(db.String(36), db.ForeignKey(User.id), nullable=False)
    type = db.Column(db.String(50), nullable=False)

    def __init__(self, name, type, owner_id, parent_id, text_id=None, file_id=None, folder_id=None):
        """
        Initialize a new FolderFxS instance.

        Parameters:
        - name (str): The name of the folder or file structure.
        - type (str): The type of the object (folder, file, etc.).
        - owner_id (str): The ID of the user who owns this structure.
        - parent_id (str): The ID of the parent folder structure.
        - text_id (str): Optional; the ID of the associated text.
        - file_id (str): Optional; the ID of the associated file.
        - folder_id (str): Optional; the ID of the associated folder.
        """
        self.name = name
        self.type = type
        self.text_id = text_id
        self.file_id = file_id
        self.folder_id = folder_id
        self.owner_id = owner_id
        self.parent_id = parent_id

    def to_dict(self):
        """
        Convert the FolderFxS object to a dictionary representation.

        Returns:
        - dict: Dictionary containing FolderFxS attributes.
        """
        return {
            'id': self.id,
            'name': self.name,
            'text_id': self.text_id,
            'owner_id': self.owner_id,
            'file_id': self.file_id,
            'folder_id': self.folder_id,
            'added_at': str(self.added_at),
            'type': self.type,
        }

    def __repr__(self):
        """
        Return a string representation of the FolderFxS object.

        Returns:
        - str: String representation of the FolderFxS instance.
        """
        return f'<FolderFxS {self.id} - {self.name} - {self.type}>'
