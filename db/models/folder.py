import os
from db import db
from .base import Base
from .user import User
from datetime import datetime


class Folder(Base):
    __tablename__ = 'folder'

    id = db.Column(db.Integer, primary_key=True)
    foldername = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    owner_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('Folder.id'), nullable=True)
    parent_id = db.relationship('Folder', remote_side=[id], backref=db.backref('children', lazy='dynamic'))

    def __init__(self, foldername, owner_id, parent_id=None):
        self.foldername = foldername
        self.owner_id = owner_id
        self.parent_id = parent_id
    
    def to_dict(self):
        return  {
                'id': self.id,
                'owner_id': self.owner_id,
                'parent_id': self.parent_id,
                'foldername': self.foldername,
                'created_at': self.created_at,
                }

    def __repr__(self):
        return f'<Folder {self.id} - {self.foldername}>'