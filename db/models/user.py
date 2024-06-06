from db import db
import os
from werkzeug.security import generate_password_hash, check_password_hash
from .base import Base
from flask_login import UserMixin

class User(Base, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    if os.getenv("DB_TYPE") == 'mysql':
        files = db.relationship('File', backref='owner', lazy=True,  cascade='delete')
        texts = db.relationship('Text', backref='owner', lazy=True,  cascade='delete')

    #def __init__(self, email, username, password ):
    #    self.email = email
    #    self.set_password(password)
    #    self.username = username

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.username}>'