"""
Module: Project Structure Management

This module is responsible for managing the project structure by retrieving files, 
texts, and subfolders from the database and creating a corresponding structure in 
a temporary directory. It provides functionality for organizing these resources 
into a filesystem-like structure.

Features include:
- Creating a temporary directory structure that mirrors the database structure.
- Handling file and text retrieval based on folder hierarchies.
- Marking entry points for easy access to specific resources.

Dependencies:
- Requires models from the database, including File, Folder, and Text.
- Utilizes standard libraries like shutil and tempfile for filesystem operations.

Usage:
This module is designed to be integrated into a Flask application with SQLAlchemy 
set up for managing project resources.
"""

from db.models.file import File
from db.models.folder import Folder
from db.models.folderfxs import FolderFxS
from db.models.text import Text
import shutil
import os
import tempfile
from .route_utility import get_child_files, get_child_texts, get_child_subfolders
from .unique import unique_name


def clean_temp_dir(temp_dir: str) -> None:
    """
    Remove the temporary directory if it exists.

    :param temp_dir: The path to the temporary directory to be removed.
    """
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)


def create_temp_structure(folder: Folder, base_path: str = '', entry_point_id: int = None) -> tuple:
    """
    Recursively retrieves files, texts, and subfolders from the database and 
    creates a corresponding structure in a temporary directory.

    :param folder: Folder object (the current folder).
    :param base_path: Base path for the current folder in the temp directory.
    :param entry_point_id: ID of the entry point (file or text) to be marked.
    :return: Tuple containing the entry point (file or text) and its path.
    """
    # Create a directory for the current folder in the temporary folder
    folder_path = os.path.join(base_path, folder.foldername)
    os.makedirs(folder_path, exist_ok=True)

    # Retrieve files and texts in the current folder
    files_objs = get_child_files(folder.id)
    texts = get_child_texts(folder.id)

    entry_point = None
    entry_point_path = None  # Capture the full path of the entry point

    # Add files to the folder in the temp structure
    for file in files_objs:
        file_path = os.path.join(folder_path, file['file'].filename)
        with open(file_path, 'wb') as f:
            f.write(file['file'].data)
        # Check if this file is the entry point
        if file['file'].id == entry_point_id:
            entry_point = file
            entry_point_path = file_path

    # Add texts to the folder in the temp structure
    for text in texts:
        text_path = os.path.join(
            folder_path, unique_name(text['text'].file_type))
        with open(text_path, 'w') as f:
            f.write(text['text'].content)
        # Check if this text is the entry point
        if text['text'].id == entry_point_id:
            entry_point = text
            entry_point_path = text_path

    # Recursively handle subfolders
    subfolders = get_child_subfolders(folder.id)
    for subfolder in subfolders:
        ep, ep_path = create_temp_structure(
            subfolder['folder'], folder_path, entry_point_id)
        # If an entry point is found in a subfolder, propagate it up
        if ep:
            entry_point = ep
            entry_point_path = ep_path

    return entry_point, entry_point_path


def project_structure_folder(parent_folder_id: int, entry_point_id: int, temp_dir: str) -> tuple:
    """
    Retrieve files and scripts from the database based on the parent folder ID and 
    entry point ID. This method will create the folder structure inside the 
    provided temporary directory.

    :param parent_folder_id: The ID of the parent folder to start retrieval.
    :param entry_point_id: The ID of the entry point (file or text).
    :param temp_dir: The path to the existing temporary directory where the 
                     structure will be created.
    :return: Tuple containing the entry point (file or text) and its path.
    """
    # Fetch the root folder from the database
    folder = Folder.query.get(parent_folder_id)
    if not folder:
        raise ValueError("Folder not found")

    # Recursively retrieve the folder structure and find the entry point
    entry_point, entry_point_path = create_temp_structure(
        folder, temp_dir, entry_point_id)

    return entry_point, entry_point_path


def project_structure_filexscript(id: int, type: str) -> str:
    """
    Retrieve a single file or script (text) from the database based on the ID and 
    type, and save it in a temporary directory.

    :param id: The ID of the file or script.
    :param type: The type of the item ('file' or 'script').
    :return: The path to the temporary directory containing the file or script.
    """
    # Create a temporary directory
    temp_dir = tempfile.mkdtemp()

    if type == 'file':
        # Retrieve the file based on the provided ID
        file_record = File.query.get(id)
        if not file_record:
            raise ValueError("File not found")

        # Create a path for the file in the temp folder
        file_path = os.path.join(temp_dir, file_record.filename)

        # Write the file's binary data to the temp folder
        with open(file_path, 'wb') as f:
            f.write(file_record.data)

    elif type == 'script':
        # Retrieve the script (text) based on the provided ID
        text_record = Text.query.get(id)
        if not text_record:
            raise ValueError("Script not found")

        # Generate a unique name for the text file
        text_filename = unique_name(text_record.file_type)

        # Create a path for the script in the temp folder
        text_path = os.path.join(temp_dir, text_filename)

        # Write the script's content to the temp folder
        with open(text_path, 'w') as f:
            f.write(text_record.content)

    else:
        raise ValueError("Invalid type. Must be 'file' or 'script'.")

    return temp_dir


def determine_entry_point(parent_folder_id: int, entry_point_id: int, type: str, temp_dir: str) -> tuple:
    """
    Determine the entry point based on folder hierarchy or item type.

    :param parent_folder_id: The ID of the parent folder, if applicable.
    :param entry_point_id: The ID of the entry point to be determined.
    :param type: The type of the entry point ('File' or 'Text').
    :param temp_dir: The path to the temporary directory.
    :return: Tuple containing the entry point (file or text) and its path.
    """
    if parent_folder_id:
        return project_structure_folder(parent_folder_id, entry_point_id, temp_dir)
    elif type == 'File':
        return project_structure_filexscript(entry_point_id, 'file')
    elif type == 'Text':
        return project_structure_filexscript(entry_point_id, 'script')
    raise ValueError("Entry point not found.")
