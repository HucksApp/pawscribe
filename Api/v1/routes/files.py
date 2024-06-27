from flask import Blueprint, request, jsonify, send_file
from db.models.file import File
from db.models.folder import Folder
from db.models.folderfxs import FolderFxS

from Api.__init__ import db, socketio
from ..utils.required import token_required
from ..utils.allowed import allowed_file
from ..utils.unique import unique_name
from db import db
from secrets import token_urlsafe
from io import BytesIO
from datetime import datetime
#from . import app  as files

files_bp = Blueprint('files', __name__, url_prefix='files')


@files_bp.route('/all', methods=['GET'])
@token_required
def list_files(current_user):
    files = File.query.filter_by(owner_id=current_user.id).all()
    return jsonify([file.to_dict() for file in files]), 200


@files_bp.route('/upload', methods=['POST'])
@token_required
def uploadfile(current_user):
    msg = {'message': "", "valid": False}
    if 'file' not in request.files:
        msg.update({"message": "No file part"})
        return jsonify(msg), 400
    file = request.files['file']
    if file.filename == '':
        msg.update({'message': "No selected file"})
        return jsonify(msg), 400
    if file and allowed_file(file.filename, msg):
        file_data = file.read()
        file_hash = File.generate_bin_hash(file_data)
        existing_file = File.query.filter_by(hash=file_hash).first()
        if existing_file:
            msg.update({'message': 'File already exists', 'file_id': existing_file.id})
            return jsonify(msg), 409
        new_file = File(filename=file.filename, data=file_data, owner_id=current_user.id)
        db.session.add(new_file)
        db.session.commit()
        msg.update({'message': 'File uploaded', 'valid':True})
        return jsonify(msg), 200
    if msg != "": 
        return jsonify(msg), 405 
    msg.update({"message": "File error"})
    return jsonify(msg), 400

@files_bp.route('/<file_id>', methods=['GET'])
@token_required
def get_file(current_user,file_id):
    msg = {"message": "", "valid": False}
    file = File.query.get(file_id)
    if file:
        if file.shared_with_key:
            if current_user.id == file.user_id:
                return jsonify(file.to_dict()), 200
            elif request.args.get('shared_with_key') == file.shared_with_key:
                msg.update({"message":"File Found", "valid": True, "file": file.to_dict()})
                return jsonify(msg), 200
            else:
                msg.update({"message":"Invalid sharing key"})
                return jsonify(msg), 401
        msg.update({"message":"File Found", "valid": True, "file": file.to_dict()})
        return jsonify(msg), 200
    msg.update({"message": "File not found"})
    return jsonify(msg), 404

@files_bp.route('/<int:file_id>', methods=['DELETE'])
@token_required
def delete_file(current_user, file_id):
    msg = {"message": "", "valid": False}
    file = File.query.get_or_404(file_id)
    if file.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    db.session.delete(file)
    db.session.commit()
    msg.update({'message': 'File deleted', "valid": True, "file_id": file.id})
    return jsonify(msg), 200

@files_bp.route('/download/<int:file_id>', methods=['GET'])
@token_required
def download_file(current_user, file_id):
    msg = {'message': 'Permission denied'}
    file = File.query.get_or_404(file_id)
    if file.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    return send_file(BytesIO(file.data), download_name=file.filename, as_attachment=False)

@files_bp.route('/edit/<int:file_id>', methods=['GET'])
@token_required
def edit_file(current_user, file_id):
    msg = {"message": "", "valid": False}
    file:File  = File.query.get_or_404(file_id)
    if file:
        if current_user.id != file.owner_id:
            msg.update({'message': 'Permission denied'})
            return jsonify(msg), 403
        content = BytesIO(file.data).read().decode("utf-8")
        file_info = file.to_dict()
        msg.update({**file_info, 'message': 'success', "content":content, "valid": True})
        return jsonify(msg), 200
    msg.update({"message": "File not found"})
    return jsonify(msg), 404



@files_bp.route('/save', methods=['POST'])
@token_required
def handle_save_file(current_user,data):
    msg = {"message": "", "valid": False}
    data = request.get_json()
    content = data.get('content')
    file_name = data.get('file_name', 'Doc') 
    file_id = data.get('file_id') if 'file_id' in data else None
    file_hash = File.generate_text_hash(content)
    existing_file = File.query.filter_by(hash=file_hash).first()
    if existing_file:
        msg.update({'message': 'File already exists', 'file_id': existing_file.id})
        return jsonify(msg), 409
    if file_id:
        file:File  = File.query.get_or_404(file_id)
        if file :
            if file.owner_id != current_user.id:
                msg.update({'message': 'Permission denied'})
                return jsonify(msg), 403
            file.data = content
    else:
        file_name = unique_name(filename=file_name)
        new_file = File(filename=file_name, data=content, owner_id=current_user.id)
        db.session.add(new_file)
    db.session.commit()
    msg.update({'message': 'File saved', 'valid':True, "file_id": new_file.id})
    return jsonify(msg), 200

@files_bp.route('/share/<int:file_id>', methods=['GET'])
@token_required
def share_file(current_user, file_id):
    msg = {"message": "", "valid": False}
    file = File.query.get_or_404(file_id)
    if file.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    if file.private:
        key = token_urlsafe(8)
        file.shared_with_key = key
        msg.update({"shared_with_key": key })
    else:
        file.shared_with_key = None
    db.session.commit()
    msg.update({"message": "File Shared", "valid": True, "file_id": file.id })
    return jsonify(msg), 200


@files_bp.route('/private/<int:file_id>', methods=['GET'])
@token_required
def private_file(current_user, file_id):
    msg = {"message": "", "valid": False}
    file = File.query.get_or_404(file_id)
    print(file.private, '111')
    if file.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    if file.private:
        file.private = False
        file.shared_with_key = None
    else:
        file.private = True
    file.updated_at = datetime.now()
    print(file.private, '222')
    db.session.commit()
    msg.update({"message": f"File Set To Private  is now {file.private}", "valid": True, "file_id": file.id })
    return jsonify(msg), 200

