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
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, filename, owner_id, data):
        self.filename = filename
        self.owner_id = owner_id
        self.data = data
        self.hash = self.generate_bin_hash(data)


    def to_dict(self):
        return  {
                'id': self.id,
                'filename': self.filename,
                'timestamp': str(self.timestamp),
                'owner_id': self.owner_id,
                'private': self.private,
                'shared_with_key': self.shared_with_key,
                'hash': self.hash
                }

    def __repr__(self):
        return f'<File {self.filename}>'


class Text(Base):
    __tablename__ = 'text'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text(400), nullable=False)
    file_type = db.Column(db.String(20), nullable=False)
    hash = db.Column(db.String(64), unique=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    file_id = db.Column(db.Integer, db.ForeignKey(File.id), nullable=True)
    private = db.Column(db.Boolean, default=True)
    shared_with_key = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


    def __init__(self, content, file_type, owner_id, private=True, shared_with_key=None):
        self.content = content
        self.file_type = file_type
        self.owner_id = owner_id
        self.private = private
        self.shared_with_key = shared_with_key
        self.hash = self.generate_text_hash(content)
    
    def to_dict(self):
        return  {
                'id': self.id,
                'content': self.content,
                'owner_id': self.owner_id,
                'file_type': self.file_type,
                'created_at': self.created_at,
                'updated_at': self.updated_at,
                'private': self.private,
                'hash': self.hash
                }

    def __repr__(self):
        return f'<Text {self.id} - {self.file_type}>'