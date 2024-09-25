"""
Module: File and Text Synchronization

This module handles the synchronization of files and text resources in a 
folder structure. It provides functionality for updating existing resources 
or creating new ones based on their content and hashes.

Features include:
- Synchronization of file and text content.
- Handling of updates based on hash comparisons.
- Creation of new entries in case of updates or changes.
- Reference management in folders.

Dependencies:
- SQLAlchemy for ORM interactions.
- Models for File and Text are expected to be defined in `db.models`.

Usage:
This module is designed to be integrated into a Flask application with 
SQLAlchemy set up for managing file and text resources.
"""

from sqlalchemy.orm import joinedload
from typing import List, Union, Dict, Set
from db.models.text import Text
from base64 import b64decode
from db.models.file import File
from db.models.folder import Folder
from db.models.folderfxs import FolderFxS
from .unique import unique_name
from Api.__init__ import db
import os
from datetime import datetime


def handle_file_sync(fx, file_id: Union[int, None], file_hash: Union[str, None], content: str, name: str, parent_folder_id: int, current_user) -> Dict[str, Union[str, bool]]:
    """
    Synchronize a file's content with the database.

    This function checks if a file exists based on its ID or hash.
    If it exists and the content has changed, it updates the file.
    If it does not exist, it creates a new file or creates a reference 
    to an existing file with the new content.

    Args:
        fx: The file context, typically an object representing the file.
        file_id (Union[int, None]): The ID of the existing file, if any.
        file_hash (Union[str, None]): The hash of the file's content, if available.
        content (str): The content of the file.
        name (str): The name of the file.
        parent_folder_id (int): The ID of the parent folder to which the file belongs.
        current_user: The current user object performing the operation.

    Returns:
        Dict[str, Union[str, bool]]: A message and validity status indicating the 
        result of the synchronization operation.
    """
    msg = {"message": "", "valid": False}

    existing_file = None
    if file_id:
        existing_file = File.query.get(file_id)
    elif file_hash:
        existing_file = File.query.filter_by(hash=file_hash).first()
    if existing_file:
        current_hash = File.generate_hash(content.encode('utf-8'))
        if current_hash != existing_file.hash:
            all_parents = FolderFxS.query.filter_by(
                type='Folder', file_id=existing_file.id, owner_id=current_user.id).all()

            if len(all_parents) <= 1:
                existing_file.data = content.encode('utf-8')
                existing_file.hash = current_hash
                existing_file.updated_at = datetime.utcnow()
                db.session.commit()
                msg = {"message": f"{existing_file.filename} content was updated.", "valid": True}
            else:
                file_with_new_content = File.query.filter_by(
                    hash=current_hash).first()

                if file_with_new_content:
                    new_fx = FolderFxS(
                        type='File',
                        file_id=file_with_new_content.id,
                        folder_id=parent_folder_id,
                        name=name,
                        owner_id=current_user.id
                    )
                    db.session.add(new_fx)
                    db.session.commit()

                    msg = {"message": f"File with new content referenced as {new_fx.name}.", "valid": True}
                else:
                    new_file = File(
                        filename=name,
                        data=content.encode('utf-8'),
                        hash=current_hash,
                        owner_id=current_user.id
                    )
                    db.session.add(new_file)
                    db.session.commit()

                    new_fx = FolderFxS(
                        type='File',
                        file_id=new_file.id,
                        folder_id=parent_folder_id,
                        name=name,
                        owner_id=current_user.id
                    )
                    db.session.add(new_fx)
                    db.session.commit()

                    msg = {"message": f"New file referenced as {new_fx.name}", "valid": True}
    else:
        msg = {"message": f"No file found with the given hash or id.", "valid": False}

    return msg


def handle_text_sync(fx, text_id: Union[int, None], text_hash: Union[str, None], content: str, name: str, parent_folder_id: int, current_user) -> Dict[str, Union[str, bool]]:
    """
    Synchronize a text's content with the database.

    This function checks if a text exists based on its ID or hash.
    If it exists and the content has changed, it updates the text.
    If it does not exist, it creates a new text or creates a reference 
    to an existing text with the new content.

    Args:
        fx: The text context, typically an object representing the text.
        text_id (Union[int, None]): The ID of the existing text, if any.
        text_hash (Union[str, None]): The hash of the text's content, if available.
        content (str): The content of the text.
        name (str): The name of the text.
        parent_folder_id (int): The ID of the parent folder to which the text belongs.
        current_user: The current user object performing the operation.

    Returns:
        Dict[str, Union[str, bool]]: A message and validity status indicating the 
        result of the synchronization operation.
    """
    msg = {"message": "", "valid": False}

    existing_script = None
    if text_hash:
        existing_script = Text.query.filter_by(hash=text_hash).first()
    elif text_id:
        existing_script = Text.query.get(text_id)

    if existing_script:
        current_hash = Text.generate_hash(content.encode('utf-8'))

        if current_hash != existing_script.hash:
            all_parents = FolderFxS.query.filter_by(
                type='Folder', text_id=existing_script.id, owner_id=current_user.id).all()

            if len(all_parents) <= 1:
                existing_script.content = content
                existing_script.hash = current_hash
                existing_script.updated_at = datetime.utcnow()
                db.session.commit()

                msg = {"message": "Text content updated.", "valid": True}
            else:
                script_with_new_content = Text.query.filter_by(
                    hash=current_hash).first()

                if script_with_new_content:
                    new_fx = FolderFxS(
                        type='Text',
                        text_id=script_with_new_content.id,
                        folder_id=parent_folder_id,
                        name=name,
                        owner_id=current_user.id
                    )
                    db.session.add(new_fx)
                    db.session.commit()

                    msg = {
                        "message": "Text with new content referenced.", "valid": True}
                else:
                    new_script = Text(
                        name=name,
                        content=content,
                        hash=current_hash,
                        owner_id=current_user.id
                    )
                    db.session.add(new_script)
                    db.session.commit()

                    new_fx = FolderFxS(
                        type='Text',
                        text_id=new_script.id,
                        folder_id=parent_folder_id,
                        name=name,
                        owner_id=current_user.id
                    )
                    db.session.add(new_fx)
                    db.session.commit()

                    msg = {
                        "message": "New text created with updated content.", "valid": True}

    else:
        msg = {"message": f"No text found with the given hash or id.", "valid": False}

    return msg

