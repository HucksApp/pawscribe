from db import db
from .base import Base
from .user import User
from datetime import datetime


class Folder(Base):
    __tablename__ = 'folder'

    id = db.Column(db.Integer, primary_key=True)
    foldername = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(500), nullable=True)
    language= db.Column(db.String(30), nullable=True)
    owner_id = db.Column(db.String(36), db.ForeignKey(User.id), nullable=False)

    def __init__(self, foldername,description, language, owner_id):
        self.foldername = foldername
        self.owner_id = owner_id
        self.description = description
        self.language = language
    
    def to_dict(self):
        return  {
                'id': self.id,
                'owner_id': self.owner_id,
                'foldername': self.foldername,
                'description': self.description,
                'language': self.language,
                'created_at': self.created_at,
                'updated_at': self.updated_at,
                }

    def __repr__(self):
        return f'<Folder {self.id} - {self.foldername}>'