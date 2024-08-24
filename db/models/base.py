from db import db
from hashlib import sha256
import uuid

class Base(db.Model):
    __abstract__ = True
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    
