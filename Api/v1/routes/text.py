# api/routes/text.py
from flask import Blueprint, request, jsonify
from flask_socketio import emit, join_room, leave_room
from Api import db, socketio
from db.models.file import Text
from ..utils.required import token_required
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from secrets import token_urlsafe

text_bp = Blueprint('text', __name__, url_prefix='text')

@text_bp.route('/share', methods=['POST'])
@token_required
def share_text(current_user):
    msg = {"message": "", "valid": False}
    data = request.get_json()
    text_content = data.get('text_content')
    file_type = data.get('file_type')
    private = data.get('private', True)
    shared_with_key = token_urlsafe(8) if private else None
    text_hash = Text.generate_text_hash(text_content)
    # verify if file exists with same content
    existing_text = Text.query.filter_by(hash=text_hash).first()
    if existing_text:
        if  existing_text.private == private and existing_text.file_type == file_type :
            msg.update(({'message': 'Text already exists', 'text_id': existing_text.id}))
            return jsonify(msg), 409
        else:
            existing_text.private = private
            existing_text.file_type = file_type
            existing_text. shared_with_key = shared_with_key
#           db.session.commit()
    new_text = Text(content=text_content, file_type=file_type, owner_id=current_user.id, private=private, shared_with_key=shared_with_key)
    db.session.add(new_text)
    db.session.commit()
    msg.update({'message': 'Text shared', 'valid': True, 'text_id': new_text.id, 'shared_with_key': shared_with_key})
    return jsonify(msg), 201


@text_bp.route('/<int:text_id>', methods=['GET'])
@token_required
def get_text(current_user, text_id):
    msg = {"message": "", "valid": False}
    text = Text.query.get_or_404(text_id)
    if text.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    msg.update({'message':'text retrieved','content': text.content, 'valid': True, 'file_type': text.file_type, 'private': text.private})
    return jsonify(msg), 200

@text_bp.route('/shared/<int:text_id>', methods=['GET'])
def get_shared_text(text_id):
    msg = {"message": "", "valid": False}
    shared_with_key = request.args.get('key')
    text = Text.query.get_or_404(text_id)
    if text.private and text.shared_with_key != shared_with_key:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    msg.update({'message':'text retrieved','content': text.content, 'valid': True, 'file_type': text.file_type})
    return jsonify(msg), 200

@text_bp.route('/<int:text_id>', methods=['DELETE'])
@token_required
def delete_text(current_user, text_id):
    msg = {"message": "", "valid": False}
    text = Text.query.get_or_404(text_id)
    if text.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    db.session.delete(text)
    db.session.commit()
    msg.update({'message': 'Text deleted', 'valid': True, "text_id": text.id})
    return jsonify(msg), 200



@socketio.on('join')
@token_required
def handle_join(current_user,data):
    text_id = data['text_id']
    join_room(text_id)
    print(text_id)
    emit('status', {'message': 'User has entered the room'}, room=text_id, broadcast=True)

@socketio.on('leave')
def handle_leave(data):
    text_id = data['text_id']
    leave_room(text_id)
    emit('status', {'message': 'User has left the room'}, room=text_id, broadcast=True)



@socketio.on('text_update')
@token_required
def handle_text_update(current_user,data):
    text_id = data['text_id']
    owner_id = data['owner_id']
    if owner_id != current_user.id:
            pass
    content = data['content'] if 'content' in data else None
    emit('text_updated', {'content': content}, room=text_id, broadcast=True)



@socketio.on('save_text')
@token_required
def save_text(current_user,data):
    msg = {"message": "", "valid": False}
    text_id = data['text_id'] if 'text_id' in data else None
    content = data['content'] if 'content' in data else None
    file_type = data['file_type']
    private = data['private'] if 'private' in data else False
    shared_with_key =  ['shared_with_key'] if 'shared_with_key' in data else None
    text = Text.query.get(text_id)
    text_hash = Text.generate_text_hash(content)
    existing_text = Text.query.filter_by(hash=text_hash).first()
    if text:
        text.content = content
    elif existing_text:
        existing_text.content = content
    else:
        new_text = Text(content=content, file_type=file_type, owner_id=current_user.id, private=private, shared_with_key=shared_with_key)
        db.session.add(new_text)
    db.session.commit()
    msg.update({'message': 'page saved'})
    emit('status', msg)

@socketio.on('save_to_file')
@token_required
def save_text(curent_user,data):
    pass
    #emit('status', {'message': 'User has left the room'}, room=text_id, broadcast=True)