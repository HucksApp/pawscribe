""" Auth Route Test"""
import pytest
from flask import url_for


def test_login_success(client):
    """Test successful login."""
    response = client.post(url_for('auth.login'), json={
        'username': 'test_user',
        'password': 'test_password'
    })
    data = response.get_json()
    assert response.status_code == 200
    assert data['valid'] is True
    assert 'token' in data


def test_login_failure(client):
    """Test login failure with invalid credentials."""
    response = client.post(url_for('auth.login'), json={
        'username': 'wrong_user',
        'password': 'wrong_password'
    })
    data = response.get_json()
    assert response.status_code == 401
    assert data['valid'] is False
    assert data['message'] == "Invalid credentials"


def test_logout(client):
    """Test logout functionality."""
    response = client.post(url_for('auth.logout'))
    data = response.get_json()
    assert response.status_code == 200
    assert data['valid'] is True
    assert data['message'] == "Logged out successfully"
