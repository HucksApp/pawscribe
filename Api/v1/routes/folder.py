"""
Routes for handling folders, texts, files, and their respective operations.
These routes provide APIs for searching, retrieving, adding, updating, deleting, and syncing folders and their content in the system.

Includes:
- Folder management (CRUD operations)
- Text and file management within folders
- Search functionality
- Download folders as zip
- Sync changes between frontend and backend
"""

from base64 import b64decode
from flask import Blueprint, request, jsonify, send_file
from db.models.file import File
from db.models.text import Text
from db.models.folder import Folder
from db.models.folderfxs import FolderFxS
from Api.__init__ import db
from ..utils.required import token_required
from datetime import datetime
from ..utils.unique import unique_name
from ..utils.route_utility import remove_folder_and_contents, get_child_subfolders, get_child_texts, get_child_files, get_folder_tree, handle_file_inclusion, handle_folder_inclusion, handle_text_inclusion, handle_text_exclusion, handle_folder_exclusion, handle_file_exclusion, add_folder_to_zip, get_all_children
from ..utils.route_utility2 import handle_file_sync, handle_text_sync
from io import BytesIO
import zipfile

# Blueprint definition
folders_bp = Blueprint('folders', __name__, url_prefix='/folders')


@folders_bp.route('/search', methods=['GET'])
@token_required
def search_texts(current_user):
    """
    Search for texts owned by the current user based on a query.

    Query Parameters:
    - match (str): The string to search for within text contents.
    - page (int): Pagination parameter for page number.
    - per_page (int): Pagination parameter for the number of texts per page.

    Returns:
    - A paginated result containing matching texts and pagination info.
    """
    query = request.args.get("match", "", type=str)
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    if query:
        search = f"%{query}%"
        pagination = Text.query.filter(
            Text.owner_id == current_user.id,
            Text.content.ilike(search)
        ).paginate(page=page, per_page=per_page, error_out=False)

        texts = pagination.items
        result = {
            "texts": [text.to_dict() for text in texts],
            "total": pagination.total,
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev
        }
        return jsonify(result), 200
    return jsonify({"message": "No query provided"}), 400


@folders_bp.route('/<int:folder_id>', methods=['GET'])
@token_required
def handle_get_folder(current_user, folder_id):
    """
    Retrieve a specific folder's details by its ID.

    URL Parameters:
    - folder_id (int): The ID of the folder to retrieve.

    Returns:
    - Folder details if the current user owns it, or a 403 error if not.
    """
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403

    return jsonify({"valid": True, "folder": folder.to_dict()}), 200


@folders_bp.route('/<int:folder_id>/fxs', methods=['GET'])
@token_required
def handle_get_folder_withfsx(current_user, folder_id):
    """
    Retrieve folder and its FolderFxS metadata.

    URL Parameters:
    - folder_id (int): The folder ID for which to fetch the metadata.

    Returns:
    - Folder details including FolderFxS, or 403 if the user lacks permission.
    """
    folder = Folder.query.get_or_404(folder_id)
    fx = FolderFxS.query.get_or_404(folder_id)

    if folder.owner_id != current_user.id or fx.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403

    return jsonify({"valid": True, "folder": {**folder.to_dict(), 'fx': fx}}), 200


@folders_bp.route('/all', methods=['GET'])
@token_required
def handle_get_all_folders(current_user):
    """
    Retrieve all folders belonging to the current user.

    Query Parameters:
    - page (int): Pagination page number.
    - per_page (int): Number of folders per page.

    Returns:
    - A paginated list of folders owned by the user.
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    pagination = Folder.query.filter_by(owner_id=current_user.id).paginate(
        page=page, per_page=per_page, error_out=False)

    result = {
        "folders": [folder.to_dict() for folder in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "pages": pagination.pages,
        "has_next": pagination.has_next,
        "has_prev": pagination.has_prev
    }
    return jsonify(result), 200


@folders_bp.route('/add', methods=['POST'])
@token_required
def handle_add_folder(current_user):
    """
    Add a new folder for the current user.

    Request Body:
    - foldername (str): The name of the folder.
    - description (str): Folder description (optional).
    - language (str): Folder language (optional).

    Returns:
    - Success message and the created folder details.
    """
    data = request.get_json()
    foldername = data.get('foldername')
    description = data.get('description') or None
    language = data.get('language') or None

    if not foldername:
        return jsonify({"message": "Folder name is required"}), 400

    new_folder = Folder(
        foldername=foldername, description=description,
        language=language, owner_id=current_user.id)

    db.session.add(new_folder)
    db.session.commit()

    return jsonify({"message": "Folder created", "valid": True, "folder": new_folder.to_dict()}), 201


@folders_bp.route('/<int:folder_id>/tree', methods=['GET'])
@token_required
def handle_get_folder_tree(current_user, folder_id):
    """
    Get a folder and its hierarchical structure as a tree.

    URL Parameters:
    - folder_id (int): The ID of the folder.

    Returns:
    - The folder's tree structure including subfolders and contents.
    """
    folder = Folder.query.get_or_404(folder_id)

    if folder.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403

    tree = get_folder_tree(folder_id)
    return jsonify({"valid": True, "folder": tree}), 200


@folders_bp.route('/<int:folder_id>/texts', methods=['GET'])
@token_required
def handle_folder_scripts(current_user, folder_id):
    """
    Retrieve all texts within a folder.

    URL Parameters:
    - folder_id (int): The ID of the folder to retrieve texts from.

    Returns:
    - A list of texts in the folder.
    """
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403

    texts = get_child_texts(folder_id, True)
    return jsonify({"message": "success", "texts": texts, "valid": True}), 200


@folders_bp.route('/<int:folder_id>/files', methods=['GET'])
@token_required
def handle_folder_files(current_user, folder_id):
    """
    Retrieve all files within a folder.

    URL Parameters:
    - folder_id (int): The ID of the folder to retrieve files from.

    Returns:
    - A list of files in the folder.
    """
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403

    files = get_child_files(folder_id, True)
    return jsonify({"message": "success", "valid": True, "files": files}), 200


@folders_bp.route('/<int:fxs_id>/exclude', methods=['DELETE'])
@token_required
def handle_delete_ffs(current_user, fxs_id):
    """
    Exclude a FolderFxS object (file, text, or folder) from a folder.

    URL Parameters:
    - fxs_id (int): The ID of the FolderFxS object to be excluded.

    Returns:
    - Success message after exclusion.
    """
    fxs = FolderFxS.query.get_or_404(fxs_id)
    if fxs.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403

    if fxs.type == 'Text':
        handle_text_exclusion(fxs)
    elif fxs.type == 'File':
        handle_file_exclusion(fxs)
    elif fxs.type == 'Folder':
        handle_folder_exclusion(fxs)
    else:
        return jsonify({"message": "Invalid type"}), 400

    db.session.commit()
    return jsonify({"message": "Excluded successfully", "valid": True}), 200


@folders_bp.route('/<int:folder_id>/download', methods=['GET'])
@token_required
def handle_download_folder(current_user, folder_id):
    """
    Download a folder and its contents as a zip file.

    URL Parameters:
    - folder_id (int): The ID of the folder to download.

    Returns:
    - A zip file containing the folder and its contents.
    """
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        return jsonify({"message": "Permission denied"}), 403

    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
        add_folder_to_zip(folder_id, zipf)
    zip_buffer.seek(0)

    return send_file(zip_buffer, as_attachment=True, download_name=f'{folder.foldername}.zip')
