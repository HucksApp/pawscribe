from db import db
from hashlib import sha256

class Base(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    @staticmethod
    def generate_bin_hash(data):
        return sha256(data).hexdigest()
    
    @staticmethod
    def generate_text_hash(content):
        return sha256(content.encode()).hexdigest()