"""Model Base Class"""
from db import db
from hashlib import sha256
import uuid


class Base(db.Model):
    """
    Base class for all database models in the application.

    This class serves as an abstract base class, providing a unique identifier
    (UUID) for all derived models. It uses SQLAlchemy for ORM capabilities.
    """

    __abstract__ = True  # Indicates that this class is an abstract model

    # Unique identifier for each record, automatically generated using UUID
    id = db.Column(db.String(36), primary_key=True,
                   default=lambda: str(uuid.uuid4()))
