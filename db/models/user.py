from db import db
import os
from werkzeug.security import generate_password_hash, check_password_hash
from .base import Base
from flask_login import UserMixin
import uuid

class User(Base, UserMixin):
    __tablename__ = 'user'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    if os.getenv("DB_TYPE") == 'mysql':
        files = db.relationship('File', backref='owner', lazy=True,  cascade='delete')
        texts = db.relationship('Text', backref='owner', lazy=True,  cascade='delete')
        folders = db.relationship('Folder', backref='owner', lazy=True,  cascade='delete')
        folderfx = db.relationship('FolderFxS', backref='owner', lazy=True,  cascade='delete')

    #def __init__(self, email, username, password ):
    #    self.email = email
    #    self.set_password(password)
    #    self.username = username

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username
        }

    def __repr__(self):
        return f'<User {self.username}>'