"""App Configuration Test"""
import pytest
from flask import Flask
from Api.__init__ import app as flask_app, db
from db.models.user import User


@pytest.fixture(scope='module')
def app():
    """Initialize the Flask app for testing."""
    flask_app.config['TESTING'] = True
    # In-memory database for testing
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with flask_app.app_context():
        db.create_all()  # Create tables for the database
        # Create a test user
        test_user = User(username='test_user', password='test_password')
        db.session.add(test_user)
        db.session.commit()
    yield flask_app


@pytest.fixture(scope='module')
def client(app):
    """Create a test client for making requests."""
    return app.test_client()


@pytest.fixture(scope='module')
def runner(app):
    """Create a CLI runner for invoking commands."""
    return app.test_cli_runner()
