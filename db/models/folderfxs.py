from db import db
from .base import Base
from .user import User
from.text import Text
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
    parent_id = db.Column(db.Integer, db.ForeignKey(Folder.id), nullable=True)
    folder_id = db.Column(db.Integer, db.ForeignKey(Folder.id), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    
    def __init__(self, name, type, owner_id, text_id=None, file_id=None, folder_id=None):
        self.name = name
        self.type = type
        self.text_id = text_id
        self.file_id = file_id
        self.folder_id = folder_id
        self.owner_id = owner_id


    def to_dict(self):
        return  {
                'id': self.id,
                'name': self.name,
                'text_id': self.text_id,
                'owner_id': self.owner_id,
                'file_id': self.file_id,
                'folder_id': self.owner_id,
                'added_at': self.added_at,
                'type': self.type,
               
                }

    def __repr__(self):
        return f'<FolderFXS {self.id} - {self.name} - {self.type}>'

