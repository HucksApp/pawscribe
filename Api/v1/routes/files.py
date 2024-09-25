"""Files Routes"""
from flask import Blueprint, request, jsonify, send_file
from db.models.file import File
from db.models.folderfxs import FolderFxS
from db.models.folder import Folder
from Api.__init__ import db
from ..utils.required import token_required
from ..utils.allowed import allowed_file
from ..utils.unique import unique_name
from secrets import token_urlsafe
from io import BytesIO
from datetime import datetime

# Blueprint for file-related routes
files_bp = Blueprint('files', __name__, url_prefix='files')


@files_bp.route('/search', methods=['GET'])
@token_required
def search_files(current_user):
    """
    Search for files owned by the current user that match a given query.

    - Query parameter: "match" (search term)
    - Pagination support with "page" and "per_page"
    - Returns a list of files that contain the search term in the filename (case-insensitive)

    :param current_user: The current authenticated user from the token
    :return: JSON with matching files, pagination metadata, or an error message
    """
    query = request.args.get("match", "", type=str)  # Get the search query
    page = request.args.get("page", 1, type=int)     # Get current page
    per_page = request.args.get("per_page", 10, type=int)  # Get per_page limit

    if query:
        search = f"%{query}%"
        # Paginate the search results based on the query
        pagination = File.query.filter(
            File.owner_id == current_user.id,
            File.filename.ilike(search)
        ).paginate(page=page, per_page=per_page, error_out=False)

        files = pagination.items
        result = {
            "files": [file.to_dict() for file in files],
            "total": pagination.total,
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev
        }
        return jsonify(result), 200
    else:
        return jsonify({"message": "No query provided"}), 400


@files_bp.route('/all', methods=['GET'])
@token_required
def list_files(current_user):
    """
    List all files belonging to the current user, with pagination.

    - Pagination support with "page" and "per_page"
    - Returns public/private file counts and file list

    :param current_user: The current authenticated user from the token
    :return: JSON with file data, file counts, and pagination metadata
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Paginate the files owned by the current user
    pagination = File.query.filter_by(owner_id=current_user.id).paginate(page=page, per_page=per_page, error_out=True)
    
    # Count public and private files for the current user
    public_count = File.query.filter_by(owner_id=current_user.id, private=False).count()
    private_count = File.query.filter_by(owner_id=current_user.id, private=True).count()
    
    files = pagination.items
    result = {
        "files": [file.to_dict() for file in files],
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


@files_bp.route('/upload', methods=['POST'])
@token_required
def uploadfile(current_user):
    """
    Upload a new file for the current user.

    - Validates the file and checks for duplicates using file hash
    - If valid, the file is saved to the database
    - Returns a success message or an error

    :param current_user: The current authenticated user from the token
    :return: JSON with upload result or error message
    """
    msg = {'message': "", "valid": False}
    
    # Check if 'file' is present in the request
    if 'file' not in request.files:
        msg.update({"message": "No file part"})
        return jsonify(msg), 400
    
    file = request.files['file']
    if file.filename == '':
        msg.update({'message': "No selected file"})
        return jsonify(msg), 400
    
    # Validate the file format and check for duplicates
    if file and allowed_file(file.filename, msg):
        file_data = file.read()
        file_hash = File.generate_hash(file_data)
        existing_file = File.query.filter_by(hash=file_hash).first()
        
        if existing_file:
            msg.update({'message': 'File already exists', 'file_id': existing_file.id})
            return jsonify(msg), 400
        
        # Create and save new file
        new_file = File(
            filename=file.filename,
            data=file_data,
            owner_id=current_user.id
        )
        db.session.add(new_file)
        db.session.commit()
        
        msg.update({'message': 'File uploaded', 'valid': True})
        return jsonify(msg), 200
    
    return jsonify(msg), 405 if msg != "" else 400


@files_bp.route('/<file_id>', methods=['GET'])
@token_required
def get_file(current_user, file_id):
    """
    Retrieve a file by its ID for the current user.

    - If the file is shared, validates the shared key
    - Returns file details if found

    :param current_user: The current authenticated user from the token
    :param file_id: The ID of the file to retrieve
    :return: JSON with file details or error message
    """
    msg = {"message": "", "valid": False}
    file = File.query.get(file_id)
    
    if file:
        if file.shared_with_key:
            # Verify if the user is the owner or if the correct shared key is provided
            if current_user.id == file.user_id:
                return jsonify(file.to_dict()), 200
            elif request.args.get('shared_with_key') == file.shared_with_key:
                msg.update({"message": "File Found", "valid": True, "file": file.to_dict()})
                return jsonify(msg), 200
            else:
                msg.update({"message": "Invalid sharing key"})
                return jsonify(msg), 401
        
        msg.update({"message": "File Found", "valid": True, "file": file.to_dict()})
        return jsonify(msg), 200
    
    msg.update({"message": "File not found"})
    return jsonify(msg), 404


@files_bp.route('/<int:file_id>', methods=['DELETE'])
@token_required
def delete_file(current_user, file_id):
    """
    Delete a file by its ID for the current user.

    - Checks if the file belongs to the current user
    - Returns an error if the file is linked to a folder

    :param current_user: The current authenticated user from the token
    :param file_id: The ID of the file to delete
    :return: JSON with success or error message
    """
    msg = {"message": "", "valid": False}
    file = File.query.get_or_404(file_id)
    
    # Verify file ownership
    if file.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    
    # Check if the file is linked to any folders
    existing_fxs = FolderFxS.query.filter_by(file_id=file_id).first()
    if existing_fxs:
        parent_folder = Folder.query.get_or_404(existing_fxs.parent_id)
        msg.update({'message': f'Exclude this file from Folder {parent_folder.foldername}'})
        return jsonify(msg), 403
    
    # Delete the file
    db.session.delete(file)
    db.session.commit()
    msg.update({'message': 'File deleted', "valid": True, "file_id": file.id})
    return jsonify(msg), 200


@files_bp.route('/download/<int:file_id>', methods=['GET'])
@token_required
def download_file(current_user, file_id):
    """
    Download a file by its ID.

    - Only the owner can download the file
    - Sends the file data as an attachment

    :param current_user: The current authenticated user from the token
    :param file_id: The ID of the file to download
    :return: The file as an attachment
    """
    msg = {'message': 'Permission denied'}
    file = File.query.get_or_404(file_id)
    
    if file.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    
    # Return the file data as an attachment
    return send_file(
        BytesIO(file.data),
        download_name=file.filename,
        as_attachment=True
    )


@files_bp.route('/edit/<int:file_id>', methods=['GET'])
@token_required
def edit_file(current_user, file_id):
    """
    Edit the content of a file by its ID.

    - Only the owner can edit the file
    - Returns file metadata and content for editing

    :param current_user: The current authenticated user from the token
    :param file_id: The ID of the file to edit
    :return: JSON with file content and metadata
    """
    msg = {"message": "", "valid": False}
    file: File = File.query.get_or_404(file_id)
    
    if file:
        if current_user.id != file.owner_id:
            msg.update({'message': 'Permission denied'})
            return jsonify(msg), 403
        
        # Return file content and metadata for editing
        content = BytesIO(file.data).read().decode("utf-8")
        file_info = file.to_dict()
        msg.update({**file_info, 'message': 'success', "content": content, "valid": True})
        return jsonify(msg), 200
    
    msg.update({"message": "File not found"})
    return jsonify(msg), 404


@files_bp.route('/save', methods=['POST'])
@token_required
def handle_save_file(current_user):
    """
    Save a file or update its content.

    - If a file ID is provided, the content is updated
    - If no file ID is provided, a new file is created
    - Prevents duplicate files using content hash

    :param current_user: The current authenticated user from the token
    :return: JSON with save result or error message
    """
    msg = {"message": "", "valid": False}
    data = request.get_json()
    content = data.get('content')
    file_name = data.get('file_name', 'Doc')
    file_id = data.get('file_id') if 'file_id' in data else None
    
    # Generate a hash for the file content to prevent duplicates
    file_hash = File.generate_text_hash(content)
    existing_file = File.query.filter_by(hash=file_hash).first()
    
    if existing_file:
        msg.update({'message': 'File already exists', 'file_id': existing_file.id})
        return jsonify(msg), 409
    
    # Update an existing file or create a new one
    if file_id:
        file: File = File.query.get_or_404(file_id)
        if file:
            if file.owner_id != current_user.id:
                msg.update({'message': 'Permission denied'})
                return jsonify(msg), 403
            file.data = content
    else:
        file_name = unique_name(filename=file_name)
        new_file = File(
            filename=file_name,
            data=content,
            owner_id=current_user.id
        )
        db.session.add(new_file)
    
    db.session.commit()
    msg.update({'message': 'File saved', 'valid': True, "file_id": new_file.id})
    return jsonify(msg), 200


@files_bp.route('/share/<int:file_id>', methods=['GET'])
@token_required
def share_file(current_user, file_id):
    """
    Share a file by generating a sharing key.

    - Only the owner can share the file
    - If the file is private, a sharing key is created
    - If the file is public, the sharing key is removed

    :param current_user: The current authenticated user from the token
    :param file_id: The ID of the file to share
    :return: JSON with the sharing key and success message
    """
    msg = {"message": "", "valid": False}
    file = File.query.get_or_404(file_id)
    
    # Verify ownership
    if file.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    
    # Toggle sharing key based on file privacy
    if file.private:
        key = token_urlsafe(8)
        file.shared_with_key = key
        msg.update({"shared_with_key": key})
    else:
        file.shared_with_key = None
    
    db.session.commit()
    msg.update({"message": "File Shared", "valid": True, "file_id": file.id})
    return jsonify(msg), 200


@files_bp.route('/private/<int:file_id>', methods=['GET'])
@token_required
def private_file(current_user, file_id):
    """
    Toggle the privacy status of a file.

    - Only the owner can change the privacy status
    - If the file is private, it becomes public and vice versa

    :param current_user: The current authenticated user from the token
    :param file_id: The ID of the file to toggle privacy
    :return: JSON with updated privacy status
    """
    msg = {"message": "", "valid": False}
    file = File.query.get_or_404(file_id)
    
    # Verify ownership
    if file.owner_id != current_user.id:
        msg.update({'message': 'Permission denied'})
        return jsonify(msg), 403
    
    # Toggle privacy status
    if file.private:
        file.private = False
        file.shared_with_key = None
    else:
        file.private = True
    
    file.updated_at = datetime.now()
    db.session.commit()
    
    msg.update({"message": f"File Set To {'Private' if file.private else 'Public'}", "valid": True, "file_id": file.id})
    return jsonify(msg), 200
