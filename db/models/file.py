from db import db
from .base import Base
from .user import User
from datetime import datetime



class File(Base):
    __tablename__ = 'file'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(256), nullable=False)
    data = db.Column(db.LargeBinary(length=(2**32)-1), nullable=False)
    hash = db.Column(db.String(64), unique=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    private = db.Column(db.Boolean, default=True)
    shared_with_key = db.Column(db.String(128), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, filename, owner_id, data):
        self.filename = filename
        self.owner_id = owner_id
        self.data = data
        self.hash = self.generate_bin_hash(data)


    def to_dict(self):
        return  {
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
        return f'<File {self.filename}>'