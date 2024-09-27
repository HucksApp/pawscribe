"""
Module: text_bp
This module provides the functionality to handle text sharing, retrieval, 
and manipulation via a Flask blueprint. It supports operations such as 
creating, retrieving, updating, and deleting text entries, as well as 
socket-based real-time interactions for collaborative editing. 
"""

from flask import Blueprint, request, jsonify
from flask_socketio import emit, join_room, leave_room
from Api import db, socketio
from db.models.file import File
from db.models.text import Text
from ..utils.required import token_required
from ..utils.unique import unique_name
from secrets import token_urlsafe
from ..utils.allowed import allowed_file
from io import BytesIO
from datetime import datetime
import subprocess

text_bp = Blueprint('text', __name__, url_prefix='text')


@text_bp.route('/share', methods=['POST'])
@token_required
def share_text(current_user):
    """
    Share a new text or update an existing one.

    Parameters:
    - current_user: The authenticated user making the request.

    Request Body:
    - text_content (str): The content of the text to be shared.
    - file_type (str): The type of the file (e.g., 'markdown', 'text').
    - private (bool, optional): Indicates whether the text is private. Default is True.

    Returns:
    - JSON response with the status of the operation:
        - 201 if text is successfully shared/updated.
        - 409 if a text with the same content already exists.
    """
    msg = {"message": "", "valid": False}
    data = request.get_json()
    text_content = data.get('text_content')
    file_type = data.get('file_type')
    private = data.get('private', True)
    shared_with_key = token_urlsafe(8) if private else None
    text_hash = Text.generate_hash(text_content)

    existing_text = Text.query.filter_by(hash=text_hash).first()
    if existing_text:
        if existing_text.private == private and existing_text.file_type == file_type:
            msg.update(
                {'message': 'Content Dublication, Script exists', 'text_id': existing_text.id})
            return jsonify(msg), 409
        else:
            existing_text.private = private
            existing_text.file_type = file_type
            existing_text.shared_with_key = shared_with_key
    else:
        new_text = Text(
            content=text_content,
            file_type=file_type,
            owner_id=current_user.id,
            private=private,
            shared_with_key=shared_with_key)
        db.session.add(new_text)

    text_id = existing_text.id if existing_text else new_text.id
    db.session.commit()
    msg.update({'message': 'Text shared', 'valid': True,
               'text_id': text_id, 'shared_with_key': shared_with_key})
    return jsonify(msg), 201


@text_bp.route('/<int:text_id>', methods=['GET'])
@token_required
def get_text(current_user, text_id):
    """
    Retrieve a specific text by its ID.

    Parameters:
    - current_user: The authenticated user making the request.
    - text_id (int): The ID of the text to retrieve.

    Returns:
    - JSON response with the text content if found:
        - 200 on success.
        - 403 if the user does not have permission to access the text.
    """
    msg = {"message": "", "valid": False}
    text = Text.query.get_or_404(text_id)
    if text.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    msg.update({'message': 'Text retrieved',
                'content': text.content,
                'valid': True,
                'file_type': text.file_type,
                'private': text.private})
    return jsonify(msg), 200


@text_bp.route('/all', methods=['GET'])
@token_required
def list_texts(current_user):
    """
    List all texts owned by the current user with pagination.

    Parameters:
    - current_user: The authenticated user making the request.

    Query Parameters:
    - page (int, optional): The page number for pagination. Default is 1.
    - per_page (int, optional): Number of texts per page. Default is 10.

    Returns:
    - JSON response containing the texts and pagination information:
        - 200 on success.
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    pagination = Text.query.filter_by(owner_id=current_user.id).paginate(
        page=page, per_page=per_page, error_out=True)
    public_count = Text.query.filter_by(
        owner_id=current_user.id, private=False).count()
    private_count = Text.query.filter_by(
        owner_id=current_user.id, private=True).count()
    texts = pagination.items
    result = {
        "texts": [text.to_dict() for text in texts],
        "publicCount": public_count,
        "privateCount": private_count,
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "pages": pagination.pages,
        "has_next": pagination.has_next,
        "has_prev": pagination.has_prev
    }
    return jsonify(result), 200


@text_bp.route('/shared/<int:text_id>', methods=['GET'])
def get_shared_text(text_id):
    """
    Retrieve a shared text by its ID using a shared key.

    Parameters:
    - text_id (int): The ID of the text to retrieve.

    Query Parameters:
    - key (str): The shared key for accessing the text.

    Returns:
    - JSON response with the text content if found:
        - 200 on success.
        - 403 if permission is denied.
    """
    msg = {"message": "", "valid": False}
    shared_with_key = request.args.get('key')
    text = Text.query.get_or_404(text_id)
    if text.private and text.shared_with_key != shared_with_key:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    msg.update({'message': 'Text retrieved', 'content': text.content,
               'valid': True, 'file_type': text.file_type})
    return jsonify(msg), 200

@text_bp.route('/private/<int:text_id>', methods=['GET'])
@token_required
def private_text(current_user, text_id):
    msg = {"message": "", "valid": False}
    text: Text = Text.query.get_or_404(text_id)
    print(text.private, '111')
    if text.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    if text.private:
        text.private = False
        text.shared_with_key = None
    else:
        text.private = True
    text.updated_at = datetime.now()
    print(text.private, '222')
    db.session.commit()
    msg.update({"message": f"Script Set To {'Private' if text.private else 'Public'}",
               "valid": True, "text_id": text.id})
    return jsonify(msg), 200


@text_bp.route('/<int:text_id>', methods=['DELETE'])
@token_required
def delete_text(current_user, text_id):
    """
    Delete a specific text by its ID.

    Parameters:
    - current_user: The authenticated user making the request.
    - text_id (int): The ID of the text to delete.

    Returns:
    - JSON response indicating the status of the operation:
        - 200 on success.
        - 403 if the user does not have permission to delete the text.
    """
    msg = {"message": "", "valid": False}
    text = Text.query.get_or_404(text_id)
    if text.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    db.session.delete(text)
    db.session.commit()
    msg.update({'message': 'Text deleted', 'valid': True, "text_id": text.id})
    return jsonify(msg), 200


@text_bp.route('/to_file/<int:text_id>', methods=['POST'])
@token_required
def save_text_to_file(current_user, text_id):
    """
    Save a specific text's content to a file.

    Parameters:
    - current_user: The authenticated user making the request.
    - text_id (int): The ID of the text to save.

    Request Body:
    - filename (str, optional): The name of the file to save.
    - extension (str, optional): The extension of the file.

    Returns:
    - JSON response indicating the status of the operation:
        - 200 on success.
        - 409 if the file already exists.
        - 422 if the file extension is missing.
        - 403 if the user does not have permission to save the text.
    """
    msg = {"message": "", "valid": False}
    data = request.get_json()
    filename = data.get('filename') if 'filename' in data else None
    extension = data.get('extension') if 'extension' in data else f".{
        filename.split('.')[-1]}"
    if not extension:
        msg.update({'message': "file extension is required (type)"})
        return jsonify(msg), 422
    text: Text = Text.query.get_or_404(text_id)
    if text.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    if not filename:
        filename = unique_name(extension, filename)
    print(f'{filename}{extension} 1111111')
    if allowed_file(f'{filename}{extension}', msg):
        print(f'{filename}{extension} 2222222')
        file_hash = File.generate_hash(text.content.encode('utf-8'))
        existing_file = File.query.filter_by(hash=file_hash).first()
        if existing_file:
            msg.update({'message': f'Content Dublication, File exist as {existing_file.filename} ',
                       'file_id': existing_file.id})
            return jsonify(msg), 409
        elif msg['message'] != "":
            return jsonify(msg), 409
        file = File(
            filename=f'{filename}{extension}',
            owner_id=current_user.id,
            data=text.content.encode('utf-8'))
        text.file_id = file.id
        db.session.add(file)
        db.session.commit()
        return jsonify(msg), 200
    print(f'{filename}{extension}')
    msg.update({'message': 'File Not Supported'})
    return jsonify(msg), 409


@socketio.on('connect', namespace='/text')
def text_connect():
    """
    Handle new socket connections for real-time interactions.

    Returns:
    - None
    """
    emit('response', {'message': 'Connected to text socket'})


@socketio.on('join', namespace='/text')
def text_join(data):
    """
    Join a specific room for real-time text collaboration.

    Parameters:
    - data: Contains the room ID to join.

    Returns:
    - None
    """
    room = data['room']
    join_room(room)
    emit('response', {'message': f'Joined room: {room}'}, room=room)


@socketio.on('leave', namespace='/text')
def text_leave(data):
    """
    Leave a specific room for real-time text collaboration.

    Parameters:
    - data: Contains the room ID to leave.

    Returns:
    - None
    """
    room = data['room']
    leave_room(room)
    emit('response', {'message': f'Left room: {room}'}, room=room)


@socketio.on('send_text', namespace='/text')
def send_text(data):
    """
    Send text data to a specific room for real-time collaboration.

    Parameters:
    - data: Contains the room ID and text content to send.

    Returns:
    - None
    """
    room = data['room']
    text_content = data['text_content']
    emit('response', {'text_content': text_content}, room=room)
