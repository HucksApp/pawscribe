# api/routes/text.py
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
    
    msg = {"message": "", "valid": False}
    data = request.get_json()
    print(data)
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
    else:
        new_text = Text(content=text_content, file_type=file_type, owner_id=current_user.id, private=private, shared_with_key=shared_with_key)
        db.session.add(new_text)
    text_id =  existing_text.id if existing_text else new_text.id
    db.session.commit()
    msg.update({'message': 'Text shared', 'valid': True, 'text_id': text_id, 'shared_with_key': shared_with_key})
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

@text_bp.route('/all', methods=['GET'])
@token_required
def list_texts(current_user):
    texts = Text.query.filter_by(owner_id=current_user.id).all()
    return jsonify([text.to_dict() for text in texts]), 200


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


@text_bp.route('/to_file/<int:text_id>', methods=['POST'])
@token_required
def save_text_to_file(current_user, text_id):
    msg = {"message": "", "valid": False}
    data = request.get_json()
    filename = data.get('filename') if 'filename' in data else None
    extension = data.get('extension') if 'extension' in data else None
    if not extension:
        msg.update({'message': "file extension is required (type)"})
        return jsonify(msg), 422
    text:Text = Text.query.get_or_404(text_id)
    if text.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    if not filename:
        filename = unique_name(extension, filename)
    print(text.content)
    if allowed_file(f'{filename}{extension}', msg):
        file_hash = File.generate_bin_hash(text.content.encode('utf-8'))
        existing_file = File.query.filter_by(hash=file_hash).first()
        if existing_file:
            print("hereeeeeeeeeeee")
            msg.update({'message': 'File already exists', 'file_id': existing_file.id})
            return jsonify(msg), 409
    elif msg != "":
        return jsonify(msg),409
    file = File(filename=f'{filename}{extension}', owner_id=current_user.id, data=text.content.encode('utf-8'))
    text.file_id = file.id
    db.session.add(file)
    db.session.commit()
    return jsonify(msg), 200

    

@text_bp.route('/private/<int:text_id>', methods=['GET'])
@token_required
def private_text(current_user, text_id):
    msg = {"message": "", "valid": False}
    text:Text = Text.query.get_or_404(text_id)
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
    msg.update({"message": f"Script Set To Private is now {text.private}", "valid": True, "text_id": text.id })
    return jsonify(msg), 200


@text_bp.route('/execute', methods=['POST'])
@token_required
def execute_code(current_user):
    code = request.json.get('code')
    language = request.json.get('language')
    msg = {"message": "", "valid": False}
    
    if not code or not language:
        msg.update({'message':'Code and language are required'})
        return jsonify(msg), 400

    if language == 'python':
        try:
            result = subprocess.run(['python3', '-c', code], capture_output=True, text=True, check=True)
            output = result.stdout
        except subprocess.CalledProcessError as e:
            output = e.stderr
    elif language == 'javascript':
        try:
            result = subprocess.run(['node', '-e', code], capture_output=True, text=True, check=True)
            output = result.stdout
        except subprocess.CalledProcessError as e:
            output = e.stderr
    else:
        msg.update({'message':'Unsupported language'})
        return jsonify(msg), 400
    msg.update({'message':'successful', 'output': output, 'valid': True})
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
def handle_text_update(current_user, data):
    msg = {"message": "", "valid": False}
    text_id = data['text_id'] if 'text_id' in data else None
    owner_id = data['owner_id']
    if owner_id != current_user.id:
        msg.update({"message": "permission denied", "status": 403})
        emit('error', msg)
        return
    content = data['content'] if 'content' in data else None
    msg.update({"message": "success", "status": 200, 'content': content, "valid": True})
    emit('text_updated', msg, room=text_id, broadcast=True)

@socketio.on('save_text')
@token_required
def handle_save_text(current_user,data):
    msg = {"message": "", "valid": False}
    text_id = data['text_id'] if 'text_id' in data else None
    content = data['content'] if 'content' in data else None
    file_type = data['file_type']
    private = data['private'] if 'private' in data else False
    shared_with_key =  ['shared_with_key'] if 'shared_with_key' in data else None
    text = Text.query.get_or_404(text_id)
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
    id = text.id if text else new_text.id
    msg.update({'message': 'page saved', "valid": True, "status": 200, "text_id":id})
    emit('status', msg)


@socketio.on('save_textfd_to_file')
@token_required
def handle_save_textfd_to_file(current_user,data):
    msg = {"message": "", "valid": False}
    content = data['content']
    file_name = data['file_name']
    file_hash = File.generate_text_hash(content)
    existing_file = File.query.filter_by(hash=file_hash).first()
    if existing_file:
        msg.update({'message': 'File already exists', 'file_id': existing_file.id, "status": 409})
        emit("error", msg)
        return
    new_file = File(filename=file_name, data=content, owner_id=current_user.id)
    db.session.add(new_file)
    db.session.commit()
    msg.update({'message': 'File saved', 'valid':True, "status": 200, "file_id": new_file.id})
    emit("status", msg)
    

@socketio.on('load_text_from_file')
@token_required
def handle_load_text_from_file(current_user, data):
    msg = {"message": "", "valid": False}
    file_id = data['file_id']
    file:File  = File.query.get_or_404(file_id)
    if file:
        if current_user.id != file.owner_id:
            msg.update({'message': 'Permission denied', "status": 403})
            emit("error", msg)
            return
        content = BytesIO(file.data).read().decode("utf-8")
        file_info = file.to_dict()
        msg.update({**file_info, 'message': 'success', "status": 200, "content":content, "valid": True})
        emit("text_updated", msg, broadcast=True)
    msg.update({"message": "File not found", "status": 404})
    emit("error", msg)
    #emit('status', {'message': 'User has left the room'}, room=text_id, broadcast=True)