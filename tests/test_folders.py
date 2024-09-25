"""Folders Route Test"""
import pytest
from flask import url_for
from io import BytesIO

def test_search_texts_success(client, mocker):
    """Test successful search of texts."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('folders.search_texts', match='test'))
    assert response.status_code == 200
    assert 'texts' in response.get_json()

def test_search_texts_no_query(client, mocker):
    """Test search with no query provided."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('folders.search_texts'))
    assert response.status_code == 400
    assert response.get_json()['message'] == "No query provided"

def test_handle_get_folder_success(client, mocker):
    """Test getting a specific folder."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('folders.handle_get_folder', folder_id=1))
    assert response.status_code == 200
    assert 'folder' in response.get_json()

def test_handle_get_folder_permission_denied(client, mocker):
    """Test getting a folder with permission denied."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('folders.handle_get_folder', folder_id=999))  # Assuming 999 is not owned by the user
    assert response.status_code == 403
    assert response.get_json()['message'] == "Permission denied"

def test_handle_get_all_folders(client, mocker):
    """Test getting all folders."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('folders.handle_get_all_folders'))
    assert response.status_code == 200
    assert 'folders' in response.get_json()

def test_handle_add_folder_success(client, mocker):
    """Test successful addition of a folder."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    data = {
        'foldername': 'New Folder',
        'description': 'A test folder',
        'language': 'Python'
    }
    response = client.post(url_for('folders.handle_add_folder'), json=data)
    assert response.status_code == 201
    assert response.get_json()['valid'] is True

def test_handle_add_folder_missing_name(client, mocker):
    """Test adding a folder with missing name."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    data = {
        'description': 'A test folder',
        'language': 'Python'
    }
    response = client.post(url_for('folders.handle_add_folder'), json=data)
    assert response.status_code == 400
    assert response.get_json()['message'] == 'Folder name is required'

def test_handle_get_folder_tree(client, mocker):
    """Test getting the folder tree."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('folders.handle_get_folder_tree', folder_id=1))
    assert response.status_code == 200
    assert 'folder' in response.get_json()

def test_handle_folder_scripts(client, mocker):
    """Test getting all texts in a folder."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('folders.handle_folder_scripts', folder_id=1))
    assert response.status_code == 200
    assert 'texts' in response.get_json()

def test_handle_folder_files(client, mocker):
    """Test getting all files in a folder."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('folders.handle_folder_files', folder_id=1))
    assert response.status_code == 200
    assert 'files' in response.get_json()

def test_handle_sub_folders(client, mocker):
    """Test getting all subfolders in a folder."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('folders.handle_sub_folders', folder_id=1))
    assert response.status_code == 200
    assert 'folders' in response.get_json()

def test_handle_get_all_ffxs(client, mocker):
    """Test getting all children (subfolders, files, scripts) in a folder."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.get(url_for('folders.handle_get_all_ffxs', folder_id=1))
    assert response.status_code == 200
    assert 'children' in response.get_json()

def test_handle_save_changes(client, mocker):
    """Test saving changes to texts and files."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    data = [
        {
            'fx': {
                'file_id': 1,
                'name': 'Updated File',
                'parent_folder_id': 1,
                'type': 'File'
            },
            'hash': 'somehash',
            'content': 'Updated content'
        }
    ]
    response = client.post(url_for('folders.handle_save_changes'), json=data)
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

def test_handle_include_success(client, mocker):
    """Test successful inclusion of a new item."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    data = {
        'name': 'New Text',
        'type': 'Text',
        'parent_folder_id': 1
    }
    response = client.post(url_for('folders.handle_include'), json=data)
    assert response.status_code == 201
    assert response.get_json()['valid'] is True

def test_handle_include_invalid_type(client, mocker):
    """Test inclusion with invalid type."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    data = {
        'name': 'New Item',
        'type': 'InvalidType',
        'parent_folder_id': 1
    }
    response = client.post(url_for('folders.handle_include'), json=data)
    assert response.status_code == 400
    assert response.get_json()['message'] == 'Invalid type'

def test_handle_delete_ffs_success(client, mocker):
    """Test successful deletion of an item."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.delete(url_for('folders.handle_delete_ffs', fxs_id=1))
    assert response.status_code == 200
    assert response.get_json()['valid'] is True

def test_handle_delete_ffs_permission_denied(client, mocker):
    """Test deletion with permission denied."""
    mock_user = mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
    response = client.delete(url_for('folders.handle_delete_ffs', fxs_id=999))  # Assuming 999 is not owned by the user
    assert response.status_code == 403
    assert response.get_json()['message'] == "Permission denied"
