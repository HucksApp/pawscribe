from base64 import b64decode
from flask import Blueprint, request, jsonify, send_file
from db.models.file import File
from db.models.text import Text
from db.models.folder import Folder
from db.models.folderfxs import FolderFxS
from Api.__init__ import db
from ..utils.required import token_required
from datetime import datetime
from ..utils.unique import  unique_name
from ..utils.route_utility import remove_folder_and_contents, __find_all_decendant, get_child_subfolders,get_child_texts,get_child_files,get_folder_tree, handle_file_inclusion,handle_folder_inclusion,handle_text_inclusion, handle_text_exclusion, handle_folder_exclusion, handle_file_exclusion, add_folder_to_zip
from io import BytesIO
import zipfile


folders_bp = Blueprint('folders', __name__, url_prefix='folders')


@folders_bp.route('/<int:folder_id>', methods=['GET'])
@token_required
def handle_get_folder(current_user, folder_id):
    # get a folder <Folder>
    msg = {"message": "", "valid": False}
    folder: Folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    msg.update({"valid": True, "folder": folder.to_dict()})
    return jsonify(msg), 200




@folders_bp.route('/<int:folder_id>/fxs', methods=['GET'])
@token_required
def handle_get_folder_withfsx(current_user, folder_id):
    # get a folder <Folder>
    msg = {"message": "", "valid": False}
    folder: Folder = Folder.query.get_or_404(folder_id)
    fx: FolderFxS = FolderFxS.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id  or fx.owner_id !=  current_user.id :
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    msg.update({"valid": True, "folder": {**folder.to_dict(),'fx':fx}})
    return jsonify(msg), 200


@folders_bp.route('/all', methods=['GET'])
@token_required
def handle_get_all_folders(current_user):
    # get all folders <Folder>
    folders = Folder.query.filter_by(owner_id=current_user.id).all()
    return jsonify([folder.to_dict() for folder in folders]), 200


@folders_bp.route('/add', methods=['POST'])
@token_required
def handle_add_folder(current_user):
    # add Folder <Folder>
    msg = {"message": "", "valid": False}
    data = request.get_json()
    foldername = data.get('foldername')
    description = data.get('description') or None
    language = data.get('language') or None
    if not foldername:
        msg.update({'message': 'Folder name is required'})
        return jsonify(msg), 400
    new_folder = Folder(foldername=foldername,description=description,language=language, owner_id=current_user.id)
    db.session.add(new_folder)
    db.session.commit()
    msg.update({'message': 'Folder created', 'valid': True,
               'folder': new_folder.to_dict()})
    return jsonify(msg), 201


@folders_bp.route('/<int:folder_id>/tree', methods=['GET'])
@token_required
def handle_get_folder_tree(current_user, folder_id):
    # get a folder <Folder>
    msg = {"message": "", "valid": False}
    folder: Folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id :
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    tree = get_folder_tree(folder_id)
    msg.update({"valid": True, "folder": tree})
    return jsonify(msg), 200







@folders_bp.route('/<int:folder_id>/texts', methods=['GET'])
@token_required
def handle_folder_scripts(current_user, folder_id):
    # get all texts <Text> of a folder <Folder>
    msg = {"message": "", "valid": False}
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        msg.update({"message": "Permission denied"})
        return jsonify(msg), 403
    texts = get_child_texts(folder_id, True)
    msg.update({"message": "success", "texts": texts, "valid": True})
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
   
    files = get_child_files(folder_id, True)
    msg.update({"message": "success", "valid": True, "files": files})
    return jsonify(msg), 200



@folders_bp.route('/text', methods=['GET'])
@token_required
def handle_folder_script(current_user):
    # get text <Text> of a folder <Folder>
    msg = {"message": "", "valid": False}
    folder_id = request.args.get('folder_id')
    text_fxss_id = request.args.get('text_fxss_id')
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        msg.update({"message": "Permission denied"})
        return jsonify(msg), 403
    folder_fxss: FolderFxS = FolderFxS.query.get_or_404(id=text_fxss_id)
    text: Text = Text.query.get_or_404(id=folder_fxss.text_id)
    fxss = {**folder_fxss.to_dict(), "text": text.to_dict()}
    msg.update({"message": "success", "valid": True, "text": fxss})
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
    folder_fxss: FolderFxS = FolderFxS.query.get_or_404(id=file_fxss_id)
    file: File = File.query.get_or_404(id=folder_fxss.file_id)
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
    subfolders_list = get_child_subfolders(folder_id,True)
    msg.update({"message": "success", "valid": True,
               "folders": subfolders_list})
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
    children = __find_all_decendant(folder, True)
    print(children)
    msg.update({"message": "success", "valid": True, "children": children})
    return jsonify(msg), 200



@folders_bp.route('/include', methods=['POST'])
@token_required
def handle_include(current_user):
    msg = {"message": "", "valid": False}
    data = request.get_json()
    name = data.get('name')
    type = data.get('type')
    parent_id = data.get('parent_folder_id')

    if not type or not parent_id:
        msg.update({'message': '<parent_folder_id> and <type> are required'})
        return jsonify(msg), 400
    if type not in ['Text', 'File', 'Folder']:
        msg.update({'message': 'Invalid type'})
        return jsonify(msg), 400

    parent_folder = Folder.query.get_or_404(parent_id)
    if parent_folder.owner_id != current_user.id:
        msg.update({"message": "Permission denied"})
        return jsonify(msg), 403

    new_fxs = None

    if type == 'Text':
        # Handle Text type inclusion
        new_fxs = handle_text_inclusion(data, current_user, parent_id,parent_folder, name, msg)

    elif type == 'File':
        # Handle File type inclusion
        print(data)
        new_fxs = handle_file_inclusion(data, current_user, parent_id,parent_folder, name, msg)
        print(new_fxs)

    elif type == 'Folder':
        # Handle Folder type inclusion
        new_fxs = handle_folder_inclusion(data, current_user, parent_folder, name, parent_id, msg)

    if not new_fxs:
        return jsonify(msg), 400

    db.session.add(new_fxs)
    db.session.commit()

    msg.update({'message': 'Included successfully', 'valid': True, 'fxs': new_fxs.to_dict()})
    return jsonify(msg), 201


@folders_bp.route('/<int:fxs_id>/exclude', methods=['DELETE'])
@token_required
def handle_delete_ffs(current_user, fxs_id):
    msg = {"message": "", "valid": False}
    
    # Check for a valid `fxs_id`
    if not fxs_id:
        msg.update({'message': 'fxs_id is required'})
        return jsonify(msg), 400
    
    # Fetch the FolderFxS object to be deleted
    fxs: FolderFxS = FolderFxS.query.get_or_404(fxs_id)
    
    # Ensure the current user is the owner
    if fxs.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403

    # Determine the type of object to exclude
    if fxs.type == 'Text':
        handle_text_exclusion(fxs)
    elif fxs.type == 'File':
        handle_file_exclusion(fxs)
    elif fxs.type == 'Folder':
        handle_folder_exclusion(fxs)
    else:
        msg.update({'message': 'Invalid type'})
        return jsonify(msg), 400

    db.session.commit()
    msg.update({'message': 'Included successfully', 'valid': True})
    return jsonify(msg), 200


@folders_bp.route('/<int:folder_id>/download', methods=['GET'])
@token_required
def handle_download_folder(current_user, folder_id):
    print(folder_id,'here======>..>>')
    folder: Folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403
    
    print(folder_id)

    # Create an in-memory byte stream for the zip file
    zip_stream = BytesIO()

    # Create a ZipFile object
    with zipfile.ZipFile(zip_stream, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Add the folder and its contents to the zip
        add_folder_to_zip(zip_file, folder)

    # Seek to the beginning of the stream
    zip_stream.seek(0)

    # Send the zip file as a downloadable response
    return send_file(zip_stream, as_attachment=True, download_name=f"{folder.foldername}.zip", mimetype='application/zip')






@folders_bp.route('/<int:folder_id>/remove', methods=['DELETE'])
@token_required
def handle_delete_folder(current_user, folder_id):
    msg = {"message": "", "valid": False}

    # Retrieve the folder or return 404 if not found
    folder: Folder = Folder.query.get_or_404(folder_id)
    
    # Check if the user is the owner of the folder
    if folder.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403
    
    # Check for any subfolders
    existing_parentsfx: list[FolderFxS] = FolderFxS.query.filter_by(folder_id=folder.id, type='Folder').all()
    existing_parents: list[Folder] =[Folder.query.get(f.parent_id) for f in existing_parentsfx]
    if len(existing_parents) > 0:
        # Construct the message with a list of parent names
        parent_names = ', '.join([parent.foldername for parent in existing_parents])
        message = f"Exclude {folder.foldername} from {parent_names} before you can delete it."
        msg.update({"message": message})
        return jsonify(msg), 409  # Use 409 Conflict to indicate that deletion can't proceed
    
    # Perform the deletion
    try:
        remove_folder_and_contents(folder)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500  # Return an error message if something goes wrong

    # Return success message
    msg.update({'message': 'Deleted successfully', 'valid': True})
    return jsonify(msg), 200
