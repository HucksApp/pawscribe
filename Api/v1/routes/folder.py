from flask import Blueprint, request, jsonify, send_file
from db.models.file import File
from db.models.text import Text
from db.models.folder import Folder
from db.models.folderfxs import FolderFxS
from Api.__init__ import db
from ..utils.required import token_required
from datetime import datetime
from ..utils.route_utility import remove_all_strictly, find_all_subfolder, get_all_children, get_all_files, get_all_texts, get_all_folders

folders_bp = Blueprint('folders', __name__, url_prefix='folders')


@folders_bp.route('/<int:folder_id>', methods=['GET'])
@token_required
def handle_get_folder(current_user, folder_id):
    # get a folder <Folder>
    msg = {"message": "", "valid": False}
    folder:Folder = Folder.query.get_or_404(folder_id)
    if folder:
        if folder.owner_id != current_user.id:
            msg.update({'message': 'Permission denied'})
            return jsonify(msg), 403
    msg.update({"valid": True, "folder": folder.to_dict()})
    return jsonify(msg), 200


@folders_bp.route('/all', methods=['GET'])
@token_required
def handle_get_all_folders(current_user):
    # get all folders <Folder>
    msg = {"message": "", "valid": False}
    folders = Folder.query.filter_by(owner_id=current_user.id).all()
    folders_list = [folder.to_dict() for folder in folders]
    msg.update({"valid": True, "folders": folders_list})
    return jsonify(msg), 200


@folders_bp.route('/add', methods=['POST'])
@token_required
def handle_add_folder(current_user):
    # add Folder <Folder>
    msg = {"message": "", "valid": False}
    data = request.get_json()
    foldername = data.get('foldername')
    if not foldername:
        msg.update({'message': 'Folder name is required'})
        return jsonify(msg), 400
    new_folder = Folder(foldername=foldername, owner_id=current_user.id)
    db.session.add(new_folder)
    db.session.commit()
    msg.update({'message': 'Folder created', 'valid': True, 'folder': new_folder.to_dict()})
    return jsonify(msg), 201



@folders_bp.route('/<int:folder_id>/texts', methods=['GET'])
@token_required
def handle_folder_scripts(current_user, folder_id):
    #get texts <Text> of a folder <Folder>
    msg = {"message": "", "valid": False}
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        msg.update({"message": "Permission denied"})
        return jsonify(msg), 403
    texts = get_all_texts(folder)
    msg.update({"message": "success", "texts": texts, "valid": True})
    return jsonify(msg), 200


@folders_bp.route('/text', methods=['GET'])
@token_required
def handle_folder_script(current_user):
    msg = {"message": "", "valid": False}
    folder_id = request.args.get('folder_id')
    text_fxss_id = request.args.get('text_fxss_id')
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        msg.update({"message": "Permission denied"})
        return jsonify(msg), 403
    folder_fxss:FolderFxS = FolderFxS.query.get_or_404(id=text_fxss_id)
    text:Text =  Text.query.get_or_404(id=folder_fxss.text_id)
    fxss = {**folder_fxss.to_dict(), "text": text.to_dict()}
    msg.update({"message": "success", "valid": True, "text": fxss})
    return jsonify(msg), 200


@folders_bp.route('/<int:folder_id>/files', methods=['GET'])
@token_required
def handle_folder_files(current_user, folder_id):
    # get all files <File> of a folder
    msg = {"message": "", "valid": False}
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        msg.update({"message": "Permission denied"})
        return jsonify(msg), 403
    files = get_all_files(folder)
    msg.update({"message": "success", "valid": True, "files": files})
    return jsonify(msg), 200


@folders_bp.route('/file', methods=['GET'])
@token_required
def handle_folder_file(current_user):
    msg = {"message": "", "valid": False}
    folder_id = request.args.get('folder_id')
    file_fxss_id = request.args.get('file_fxss_id')
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        msg.update({"message": "Permission denied"})
        return jsonify(msg), 403
    folder_fxss:FolderFxS = FolderFxS.query.query.get_or_404(id=file_fxss_id)
    file:File = File.query.get_or_404(id=folder_fxss.file_id) 
    fxss = {**folder_fxss.to_dict(), "file": file.to_dict()}
    msg.update({"message": "success", "valid": True, "file": fxss})
    return jsonify(msg), 200




@folders_bp.route('/<int:folder_id>/subfolders', methods=['GET'])
@token_required
def handle_sub_folders(current_user, folder_id):
    # get all subfolders <Folder>
    msg = {"message": "", "valid": False}
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        msg.update({"message": "Permission denied"})
        return jsonify(msg), 403
    
    subfolders_list = get_all_folders(folder)
    #subfolders = folder.children.all()
    #subfolders_list = [subfolder.to_dict() for subfolder in subfolders]
    msg.update({"message": "success", "valid": True, "subfolders": subfolders_list})
    return jsonify(msg), 200



@folders_bp.route('/<int:folder_id>/children', methods=['GET'])
@token_required
def handle_get_all_ffxs(current_user, folder_id):
    # get all subfolders <Folder>, files <File>, scripts <Text> of a folder <Folder>
    msg = {"message": "", "valid": False}
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        msg.update({"message": "Permission denied"})
        return jsonify(msg), 403
    children = get_all_children(folder)
    msg.update({"message": "success", "valid": True, "children": children })
    return jsonify(msg), 200


@folders_bp.route('/include', methods=['POST'])
@token_required
def handle_include(current_user):
    # Include FxS could be 
    # File 
    # Script
    # Folder
    # if any folder or script is not save, it has to be saved and referenced
    msg = {"message": "", "valid": False}
    data = request.get_json()
    folder_id = data.get('folder_id')
    name = data.get('name')
    type = data.get('type')
    parent_id = data.get('parent_folder_id')
    text_id = data.get('text_id')
    file_type = data.get('file_type')
    file_id = data.get('file_id')
    
    if not type or not parent_id:
        msg.update({'message': '<parent_folder_id> and <type> are required'})
        return jsonify(msg), 400
    if type not in ['Text', 'File', 'Folder']:
        msg.update({'message': 'Invalid type'})
        return jsonify(msg), 400

    folder = Folder.query.get_or_404(parent_id)
    if folder.owner_id != current_user.id:
        msg.update({"message": "Permission denied"})
        return jsonify(msg), 403
    match type:
        case'Text':
            text_content = data.get('text_content')
            if not text_content:
                msg.update({'message': '<text_content> is required for <type> text'})
                return jsonify(msg), 400
            text_hash = Text.generate_text_hash(text_content)
            if text_id:
                text:Text = Text.query.get_or_404(text_id)
                isaref = FolderFxS.query.filter_by(text_id=text_id).first() is not None
                if text_hash != text.hash :
                    if isaref or not text.private:
                        if not file_type:
                            msg.update({'message': '<file_type> is required for new <type> text'})
                            return jsonify(msg), 400
                        new_text = Text(content=text_content, file_type=file_type, owner_id=current_user.id, shared_with_key=None)
                        db.session.add(new_text)
                    else:
                        text.content = text_content
                        if file_type:
                            text.file_type = file_type
            else:
                existing:Text = Text.query.filter_by(hash=text_hash).first()
                if existing :
                    text_id = existing.id
                else:
                    if not file_type:
                        msg.update({'message': '<file_type> is required for new <type> text'})
                        return jsonify(msg), 400
                    new_text = Text(content=text_content, file_type=file_type, owner_id=current_user.id, shared_with_key=None)
                    text_id = new_text.id
                    db.session.add(new_text)
            new_fxs = FolderFxS(name=name, type=type, text_id=text_id, owner_id=current_user.id, folder_id=folder_id,  parent_id=parent_id)


        case 'File':
            file_content = data.get('text_content')
            if not file_content :
                msg.update({'message': '<text_content> is required for <type> File'})
                return jsonify(msg), 400
            file_hash = File.generate_text_hash(file_content ) 
            if file_id:
                file:File = File.query.get_or_404(file_id)
                isaref = FolderFxS.query.filter_by(text_id=file_id).first() is not None
                if file_hash != file.hash:
                    if isaref or not file.private:
                        new_file = File(filename=name, data=file_content, owner_id=current_user.id)
                        db.session.add(new_file)
                    else:
                        file.data = file_content
                        if name:
                            file.filename = name
            else:
                existing:File = File.query.filter_by(hash=file_hash).first()
                if existing:
                    file_id = existing.id
                else:
                    if not name:
                        msg.update({'message': '<name> is required for new <type> File'})
                        return jsonify(msg), 400
                    new_file = File(filename=name, data=file_content, owner_id=current_user.id)
                    file_id = new_file.id
                    db.session.add(new_file)
            new_fxs = FolderFxS(name=name, type=type, file_id=file_id, owner_id=current_user.id, folder_id=folder_id, parent_id=parent_id)


        case 'Folder':
            if folder_id:
                folder:Folder= Folder.query.get_or_404(folder_id)
                if not name:
                    name = folder.foldername
            else:
                if not name:
                    msg.update({'message': 'name is required for a new folder'})
                    return jsonify(msg), 400
                folder:Folder = Folder(foldername=name, owner_id=current_user.id)
                db.session.add(folder)
                folder_id = folder.id
            new_fxs = FolderFxS(name=name, type=type, folder_id=folder_id, owner_id=current_user.id, parent_id=parent_id)
        case _:
            msg.update({'message': 'Unknown <type>'})
            return jsonify(msg), 400
    db.session.add(new_fxs)
    db.session.commit()
    msg.update({'message': 'Included successfully', 'valid': True, 'fxs': new_fxs.to_dict()})
    return jsonify(msg), 201


@folders_bp.route('/<int:fxs_id>/exclude', methods=['DELETE'])
@token_required
def handle_delete_ffs(current_user, fxs_id):
    msg = {"message": "", "valid": False}
    if not fxs_id:
        msg.update({'message': 'fxs_id is required'})
        return jsonify(msg), 400
    fxs:FolderFxS = FolderFxS.query.get_or_404(fxs_id)
    if fxs.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403
    
    match fxs.type:
        case 'Text':
            text:Text = Text.query.get_or_404(fxs.text_id)
            isnotaref = len(FolderFxS.query.filter_by(text_id=fxs.text_id).all()) <= 1
            if isnotaref:
                db.session.delete(text)
        case 'Folder':
            folder:Folder = Folder.query.get_or_404(fxs.folder_id)
            remove_all_strictly(folder)
    db.session.delete(fxs)
    db.session.commit()
    msg.update({'message': 'Deleted successfully', 'valid': True})
    return jsonify(msg), 200


@folders_bp.route('/<int:folder_id>/remove', methods=['DELETE'])
@token_required
def handle_delete_folder(current_user, folder_id):
    msg = {"message": "", "valid": False}
    if not folder_id:
        msg.update({'message': 'folder id is required'})
        return jsonify(msg), 400
    
    folder:Folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403
    
    remove_all_strictly(folder)
    db.session.delete(folder)
    db.session.commit()
    msg.update({'message': 'Deleted successfully', 'valid': True})
    return jsonify(msg), 200