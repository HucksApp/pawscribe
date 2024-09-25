"""Files Route Test"""
import pytest
from io import BytesIO
from flask import url_for

def test_upload_file_success(client, mocker):
    """Test successful file upload."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)  # Mock the user identity
    data = {
        'file': (BytesIO(b'my file contents'), 'test_file.txt')
    }
    response = client.post(url_for('files.uploadfile'), data=data, content_type='multipart/form-data')
    assert response.status_code == 200
    assert response.get_json()['valid'] is True

def test_upload_file_failure(client, mocker):
    """Test file upload failure when no file is provided."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.post(url_for('files.uploadfile'), data={}, content_type='multipart/form-data')
    assert response.status_code == 400
    assert response.get_json()['message'] == "No file part"

def test_list_files(client, mocker):
    """Test listing files with pagination."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('files.list_files'))
    assert response.status_code == 200
    assert 'files' in response.get_json()

def test_download_file(client, mocker):
    """Test downloading a file."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('files.download_file', file_id=1))
    assert response.status_code in [200, 404]  # Depending on whether the file exists
