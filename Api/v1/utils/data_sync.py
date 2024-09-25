"""
Module: Command Handlers for User File Operations

This module contains functions to handle various user commands 
related to file and folder operations in a containerized environment. 
The commands supported include creating files, moving or copying files, 
creating directories, and resolving file paths.

Dependencies:
- Text, File, Folder, FolderFxS: Database models for managing text, file, folder, and folder structures.
- unique_name: Utility function to generate unique names for files/scripts.
- db: SQLAlchemy database instance for ORM operations.
- DockerClient: Docker client for interacting with Docker containers.
- container_manager: Manager for handling active user containers.
- supported_language_match: Utility to get the file extension based on the programming language.
- get_folder_tree, find_tree_child_by_name: Utility functions for folder tree management.

Usage:
- Use the functions in this module to process user commands related to file and folder management 
within a Docker container context, ensuring database integrity and container state management.
"""

import os
import shutil
from db.models.text import Text
from db.models.file import File
from db.models.folder import Folder
from db.models.folderfxs import FolderFxS
from .unique import unique_name
from Api.__init__ import db
from docker import DockerClient
from ..store.manager import container_manager
from ..utils.allowed import supported_language_match


def handle_touch_command(command, user_id) -> str | None:
    """
    Handle the touch command to create a new file or script.

    Parameters:
    - command (str): The command string containing the action and filename.
    - user_id (str): The ID of the user executing the command.

    Returns:
    - str | None: The original command without the script flag if successful; None otherwise.
    """
    parts = command.split()
    is_script = '-s' in parts
    filename = parts[-1] if not is_script else parts[-2] if len(
        parts) == 3 else unique_name()
    content = "#!/bin/bash\n" if is_script else None

    # Create file or script in the database
    if is_script:
        container_info = container_manager.active_containers.get(user_id)
        language = container_info['language']
        file_type = supported_language_match(language)
        text = Text(content=content, file_type=file_type, owner_id=user_id)
        db.session.add(text)
        db.session.commit()
        folder_fxs = FolderFxS(name=filename, type='Text',
                               text_id=text.id, owner_id=user_id, parent_id=None)
    else:
        path_folders = filename.strip().split('/')
        filename = path_folders.pop()
        blank_data = "".encode('utf-8')
        file_hash = File.generate_hash(blank_data)
        existing_blank: File = File.query.filter_by(hash=file_hash).first()
        file = None
        if existing_blank:
            file = existing_blank
        else:
            file = File(filename=filename, owner_id=user_id, data=blank_data)
        db.session.add(file)
        db.session.commit()
        cwd_foldername = None
        if len(path_folders) > 0:
            cwd_foldername = path_folders.pop()
        else:
            container_info = container_manager.active_containers.get(user_id)
            cwd_foldername = container_info['cwd_id']

        parent_folder = Folder.query.filter_by(
            owner_id=user_id, foldername=cwd_foldername).first()
        folder_fxs = FolderFxS(name=filename, type='File', file_id=file.id,
                               owner_id=user_id, parent_id=parent_folder.id)
    db.session.add(folder_fxs)
    db.session.commit()
    if folder_fxs:
        return command.replace("-s", "")
    else:
        return None


def handle_move_or_copy_command(command, user_id):
    """
    Handle move or copy commands for files or folders.

    Parameters:
    - command (str): The command string containing the operation and paths.
    - user_id (str): The ID of the user executing the command.

    Returns:
    - str | None: The original command if successful; None otherwise.
    """
    parts = command.split()
    operation = parts[0]  # 'mv' or 'cp'

    container_info = container_manager.active_containers.get(user_id)
    cwd = container_info['cwd']

    # Resolve the source and destination paths
    source_path = resolve_path(cwd, parts[1])
    destination_path = resolve_path(cwd, parts[-1])

    src_name = os.path.basename(source_path)
    src_parent_dir = os.path.dirname(source_path)

    dest_name = os.path.basename(destination_path)
    dest_parent_dir = os.path.dirname(destination_path)

    # Fetch parent folders from DB
    src_parent_folder = Folder.query.filter_by(
        owner_id=user_id, foldername=src_parent_dir).first()
    dest_parent_folder = Folder.query.filter_by(
        owner_id=user_id, foldername=dest_parent_dir).first()

    folder_fxs = FolderFxS.query.filter_by(
        name=src_name, parent_id=src_parent_folder.id, owner_id=user_id).first()

    if folder_fxs:
        if operation == 'mv':
            folder_fxs.parent_id = dest_parent_folder.id
            folder_fxs.name = dest_name
            db.session.commit()
        elif operation == 'cp':
            new_folder_fxs = FolderFxS(name=dest_name, type=folder_fxs.type,
                                       text_id=folder_fxs.text_id, file_id=folder_fxs.file_id,
                                       folder_id=folder_fxs.folder_id, owner_id=user_id,
                                       parent_id=dest_parent_folder.id)
            db.session.add(new_folder_fxs)
            db.session.commit()
        return command
    return None


def handle_mkdir_command(command, user_id) -> str | None:
    """
    Handle the mkdir command to create a new directory.

    Parameters:
    - command (str): The command string containing the directory name.
    - user_id (str): The ID of the user executing the command.

    Returns:
    - str | None: The original command if successful; None otherwise.
    """
    parts = command.split()
    foldername = parts[1]

    container_info = container_manager.active_containers.get(user_id)
    cwd = container_info['cwd']

    # Resolve the path relative to the current directory
    target_path = resolve_path(cwd, foldername)

    # Extract the folder name from the resolved path
    name = os.path.basename(target_path)
    parent_dir = os.path.dirname(target_path)

    # Create the folder in the DB and the filesystem (as needed)
    folder = Folder(foldername=name, description=None,
                    language=None, owner_id=user_id)
    db.session.add(folder)
    db.session.commit()

    # Fetch or create the parent folder in the DB
    parent_folder = Folder.query.filter_by(
        owner_id=user_id, foldername=parent_dir).first()
    if parent_folder is None:
        parent_folder = Folder(
            foldername=parent_dir, description=None, language=None, owner_id=user_id)
        db.session.add(parent_folder)
        db.session.commit()

    # Link the new folder to its parent in FolderFxS
    folder_fxs = FolderFxS(name=name, type='Folder', folder_id=folder.id,
                           owner_id=user_id, parent_id=parent_folder.id)
    db.session.add(folder_fxs)
    db.session.commit()

    return command if folder_fxs else None


def resolve_path(current_path, target_path):
    """
    Resolve the target path relative to the current path,
    handling `..` and other relative components.

    Parameters:
    - current_path (str): The current working directory path.
    - target_path (str): The target path to resolve.

    Returns:
    - str: The resolved absolute path.
    """
    return os.path.normpath(os.path.join(current_path, target_path))

# def handle_remove_command(command, user_id):
#     pass
