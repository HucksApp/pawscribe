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


def __find_all_decendent_subfolder(folder: Folder | int, indict=False) -> List[dict]:
    """Find all subfolders of a folder recursively."""
    folder_id = folder.id if isinstance(folder, Folder) else folder
    folderlist: List[dict] = []  # Final list of all subfolders
    subfolders_to_process: List[FolderFxS] = FolderFxS.query.filter_by(
        type='Folder', parent_id=folder_id).all()
    # Track processed folder IDs to prevent cycles
    processed_subfolders: Set[int] = set()

    while subfolders_to_process:
        # Process subfolder one by one
        current_subfolder = subfolders_to_process.pop(0)

        # Check if this folder has already been processed
        if current_subfolder.folder_id in processed_subfolders:
            continue

        # Mark the current folder as processed
        processed_subfolders.add(current_subfolder.folder_id)

        # Fetch the Folder object associated with the FolderFxS object
        folder_obj = Folder.query.get(current_subfolder.folder_id)

        # Add the current folder to the folder list in the desired format
        folder_dict = {
            'folder': folder_obj,
            'fx': current_subfolder
        } if not indict else {
            **folder_obj.to_dict(),
            'fx': current_subfolder.to_dict()
        }
        folderlist.append(folder_dict)

        # Find subfolders of the current subfolder
        next_subfolders = FolderFxS.query.filter_by(
            type='Folder', parent_id=current_subfolder.folder_id).all()
        subfolders_to_process.extend(next_subfolders)
    return folderlist


def __find_all_decendant_texts(folder: Folder, indict=False) -> List[dict[str, Text | FolderFxS]]:
    """Get all texts of a folder, including those in its subfolders."""
    subfolders = __find_all_decendent_subfolder(folder)
    texts: List[dict[str, Text | FolderFxS]] = []
    folder_id = folder.id
    direct_childs: List[FolderFxS] = FolderFxS.query.filter_by(
        type='Text', parent_id=folder_id).all()
    if indict:
        direct_child_texts = [
            {**Text.query.get_or_404(fx.text_id).to_dict(), 'fx': fx.to_dict()} for fx in direct_childs]
    else:
        direct_child_texts = [{'text': Text.query.get_or_404(
            fx.text_id), 'fx': fx} for fx in direct_childs]
    texts.extend(direct_child_texts)
    for subfolder in subfolders:
        # Get all texts in each subfolder
        text_fxss: List[FolderFxS] = FolderFxS.query.filter_by(
            type='Text', parent_id=subfolder['fx'].folder_id).all()
        for text_fxs in text_fxss:
            text: Text = Text.query.get_or_404(text_fxs.text_id)
            if indict:
                texts.append(
                    {'text': text.to_dict(), 'fx': text_fxs.to_dict()})
            else:
                texts.append({'text': text, 'fx': text_fxs})
    return texts


def __find_all_decendent_files(folder: Folder, indict=False) -> List[dict[str, File | FolderFxS]]:
    """Get all files of a folder, including those in its subfolders."""
    subfolders = __find_all_decendent_subfolder(folder)
    folder_id = folder.id
    files: List[dict[str, File | FolderFxS]] = []
    direct_childs: List[FolderFxS] = FolderFxS.query.filter_by(
        type='File', parent_id=folder_id).all()
    if indict:
        files.extend([{**File.query.get_or_404(fx.file_id).to_dict(),
                     'fx': fx.to_dict()} for fx in direct_childs])
    else:
        files.extend([{'file': File.query.get_or_404(fx.file_id), 'fx': fx}
                     for fx in direct_childs])

    for subfolder in subfolders:
        # Get all files in each subfolder
        file_fxss: List[FolderFxS] = FolderFxS.query.filter_by(
            type='File', parent_id=subfolder['fx'].folder_id).all()
        for file_fxs in file_fxss:
            file: File = File.query.get_or_404(file_fxs.file_id)
            if indict:
                files.append({**file.to_dict(), 'fx': file_fxs.to_dict()})
            else:
                files.append({'file': file, 'fx': file_fxs})
    return files


def __find_all_decendant(folder: Folder, indict=False) -> dict[str, List[dict[str, Folder | File | Text | FolderFxS]]]:
    """Get all files, texts, and subfolders of a folder."""
    files = __find_all_decendent_files(folder, indict)
    texts = __find_all_decendant_texts(folder, indict)
    folders = __find_all_decendent_subfolder(folder, indict)
    return {'files': files, 'texts': texts, "sub_folders": folders}


def handle_text_inclusion(data, current_user, parent_id, parent_folder, name, msg):
    text_id = data.get('text_id')
    text_content = data.get('content')
    text_hash = data.get('hash')
    file_type = data.get('file_type')

    if text_content and not all([text_hash, text_id]):
        # New script
        if not file_type:
            msg.update(
                {'message': '<file_type> is required for new <type> text'})
            return None
        new_text = Text(content=text_content, file_type=file_type,
                        owner_id=current_user.id, shared_with_key=None)
        db.session.add(new_text)
        db.session.commit()
        text_id = new_text.id

    elif all([text_id, text_hash]) and not text_content:
        # Old and unchanged script
        text = Text.query.get_or_404(text_id)
        file_type = text.file_type
        if text.hash != text_hash:
            msg.update(
                {'message': '<text_content> is required to change the content of a <Text> script'})
            return None

    elif all([text_content, text_id]) and not text_hash:
        # Old and changed
        text = Text.query.get_or_404(text_id)
        if not file_type:
            file_type = text.file_type
        is_referenced = FolderFxS.query.filter_by(
            text_id=text_id).first() is not None
        if is_referenced or not text.private:
            new_text = Text(content=text_content, file_type=file_type,
                            owner_id=current_user.id, shared_with_key=None)
            db.session.add(new_text)
            db.session.commit()
            text_id = new_text.id
        else:
            text.content = text_content

    elif not text_content and not text_id and text_hash:
        # Old script
        existing = Text.query.filter_by(hash=text_hash).first()
        if existing:
            text_id = existing.id
            file_type = existing.file_type
        else:
            msg.update(
                {'message': 'No Script with such Content add <text_content>'})
            return None

    elif not text_content and not text_hash and text_id:
        text = Text.query.get_or_404(text_id)
        file_type = text.file_type

    else:
        msg.update({'message': 'Required Resources Incomplete'})
        return None
    existing_fxs = FolderFxS.query.filter_by(
        parent_id=parent_id, text_id=text_id).first()
    if existing_fxs:
        msg.update({'message': f'{existing_fxs.name} has been added already to {
                   parent_folder.foldername}'})
        return None
    if not name:
        name = unique_name(file_type)

    return FolderFxS(name=name, type='Text', text_id=text_id, owner_id=current_user.id, parent_id=parent_id)


def handle_file_inclusion(data, current_user, parent_id, parent_folder, name, msg):
    file_content_64 = data.get('content')
    file_hash = data.get('hash')
    file_id = data.get('file_id')
    if file_id:
        file = File.query.get_or_404(file_id)
        if not name:
            name = file.filename

    if (file_content_64 and not file_hash and not file_id) or data.get('blank'):
        # New file
        if not name:
            msg.update(
                {'message': '<name> File Name is required for New <File> File include'})
            return None
        try:
            # Decode base64 to bytes
            file_content_bytes = b64decode(file_content_64)
        except Exception as e:
            raise Exception(f"Error decoding file content: {e}")
        # Ensure the hash is generated from bytes
        if data.get('blank'):
            file_content_bytes = "".encode('utf-8')
            file_hash = File.generate_hash(file_content_bytes)
            existing_blank: File = File.query.filter_by(hash=file_hash).first()
            if existing_blank:
                file_id = existing_blank.id
                file = existing_blank
            else:
                blank_file = File(
                    filename=name, data=file_content_bytes, owner_id=current_user.id)
                db.session.add(blank_file)
                db.session.commit()
                file_id = blank_file.id

        else:
            file_hash = File.generate_hash(file_content_bytes)
            new_file = File(filename=name, data=file_content_bytes,
                            owner_id=current_user.id)
            db.session.add(new_file)
            db.session.commit()
            file_id = new_file.id

    elif all([file_id, file_hash]) and not file_content_64:
        # Old and unchanged file
        file = File.query.get_or_404(file_id)
        if not name:
            name = file.filename
        if file_hash != file.hash:
            msg.update(
                {'message': '<text_content> is required to change the content of a <File> File'})
            return None

    elif not file_hash and all([file_id, file_content_64]):
        # Old and update
        file = File.query.get_or_404(file_id)
        try:
            # Decode base64 to bytes
            file_content_bytes = b64decode(file_content_64)
        except Exception as e:
            raise Exception(f"Error decoding file content: {e}")

        # Generate the hash based on bytes
        file_hash = File.generate_hash(file_content_bytes)
        is_referenced = FolderFxS.query.filter_by(
            file_id=file_id).first() is not None

        if (is_referenced or not file.private) and file.hash != file_hash:
            new_file = File(filename=name, data=file_content_bytes,
                            owner_id=current_user.id)
            db.session.add(new_file)
            db.session.commit()
            file_id = new_file.id
        else:
            file.data = file_content_bytes

    elif file_hash and not file_content_64 and not file_id:
        # Old or new and unchanged
        file = File.query.filter_by(hash=file_hash).first()
        if file:
            file_id = file.id
        else:
            msg.update(
                {'message': '<text_content> is required for a new <File> File'})
            return None

    elif file_id and not file_content_64 and not file_hash:
        # Old and unchanged
        file = File.query.get_or_404(file_id)
    else:
        msg.update({'message': 'Required Resources Incomplete'})
        return None

    existing_fxs = FolderFxS.query.filter_by(
        parent_id=parent_id, file_id=file_id).first()
    if existing_fxs:
        msg.update({'message': f'{file.filename} has been added already to {
                   parent_folder.foldername}'})
        return None
    return FolderFxS(name=name, type='File', file_id=file_id, owner_id=current_user.id, parent_id=parent_id)


def handle_folder_inclusion(data, current_user, parent_folder, name, parent_id, msg):
    print(f'in   -------> 444444')
    child_folder_id = data.get('folder_id')
    print(f'in   -------> {child_folder_id}')
    if child_folder_id:
        # Old folder
        child_folder = Folder.query.get_or_404(child_folder_id)
        if child_folder_id == parent_id:
            msg.update({'message': f'Cannot include {
                       parent_folder.foldername} as a subfolder to itself'})
            return None
        if not name:
            name = child_folder.foldername

        parent_subfolders = __find_all_decendent_subfolder(parent_id, True)
        parent_ancestors = __find_all_folder_ancestors_of_folder(
            parent_id, indict=True)
        child_subfolders = __find_all_decendent_subfolder(
            child_folder_id, True)
        child_ancestors = __find_all_folder_ancestors_of_folder(
            child_folder_id, indict=True)

        if any(its_included(collection, child_folder_id, 'id') for collection in [parent_subfolders, parent_ancestors]) or \
           any(its_included(collection, parent_id, 'id') for collection in [child_subfolders, child_ancestors]):
            msg.update({'message': 'Circular inclusion not allowed.'})
            return None
    else:
        # New folder
        if not name:
            msg.update(
                {'message': 'A new <Folder> requires a <name> Folder Name'})
            return None
        
        print(f'in   -------> in else 444444', current_user.id)
        print(f'in   -------> in else 444444', name)
        new_folder = Folder(foldername=name, owner_id=current_user.id)
        db.session.add(new_folder)
        db.session.commit()
        child_folder_id = new_folder.id

    return FolderFxS(name=name, type='Folder', folder_id=child_folder_id, owner_id=current_user.id, parent_id=parent_id)


def fx_repair(obj, type):
    if 'fx' not in obj:
        obj['fx'] = {'type': type}
    return obj


def get_child_subfolders(folder_id: int, indict=False) -> list[dict[str, Union[FolderFxS, Folder]]]:
    subfolders: list[FolderFxS] = FolderFxS.query.filter_by(
        parent_id=folder_id, type='Folder').all()
    subfolders_list = []
    for subfolder in subfolders:
        if indict:
            obj = {'fx': subfolder.to_dict(
            ), **Folder.query.get(subfolder.folder_id).to_dict()}
        else:
            obj = {'fx': subfolder, 'folder': Folder.query.get(
                subfolder.folder_id)}
        subfolders_list.append(fx_repair(obj, 'Folder'))
    return subfolders_list


def get_child_texts(folder_id: int, indict=False) -> list[dict[str, Union[FolderFxS, Text]]]:
    texts_fxs: list[FolderFxS] = FolderFxS.query.filter_by(
        parent_id=folder_id, type='Text').all()
    texts = []
    for textfx in texts_fxs:
        if indict:
            obj = {'fx': textfx.to_dict(), **Text.query.get(textfx.text_id).to_dict()}
        else:
            obj = {'fx': textfx, 'text': Text.query.get(textfx.text_id)}
        texts.append(fx_repair(obj, 'Text'))
    return texts


def get_child_files(folder_id: int, indict=False) -> list[dict[str, Union[FolderFxS, File]]]:
    files_fxs: list[FolderFxS] = FolderFxS.query.filter_by(
        parent_id=folder_id, type='File').all()
    files = []
    for filesfx in files_fxs:
        if indict:
            obj = {'fx': filesfx.to_dict(), **
                   File.query.get(filesfx.file_id).to_dict()}
        else:
            obj = {'fx': filesfx, 'file': File.query.get(filesfx.file_id)}
        files.append(fx_repair(obj, 'File'))
    return files


def get_all_children(folder: Folder, indict=False) -> dict[str, List[dict[str, Folder | File | Text | FolderFxS]]]:
    """Get all files, texts, and subfolders of a folder."""
    files = get_child_files(folder.id, indict)
    texts = get_child_texts(folder.id, indict)
    folders = get_child_subfolders(folder.id, indict)
    return {'files': files, 'texts': texts, "sub_folders": folders}


def __find_all_folder_ancestors_of_folder(folder_id: int, seen_folders=None, indict=False) -> List[Dict[str, Union[FolderFxS, Folder]]]:
    if seen_folders is None:
        seen_folders = set()
    # Avoid circular references by tracking seen folders
    if folder_id in seen_folders:
        return []
    seen_folders.add(folder_id)
    # Find all FolderFxS entries that reference this folder_id
    folder_fxs_entries = FolderFxS.query.filter_by(folder_id=folder_id).all()
    if not folder_fxs_entries:
        # Base case: No references found
        return []
    all_parent_folders = []
    for folder_fxs_entry in folder_fxs_entries:
        if folder_fxs_entry.parent_id is None:
            continue  # Skip if there's no parent
        # Get the parent folder
        parent_folder = Folder.query.filter_by(
            id=folder_fxs_entry.parent_id).first()
        if parent_folder is None:
            continue  # Skip if parent folder is not found
        # Recursively get all parent folders
        parent_folders = __find_all_folder_ancestors_of_folder(
            parent_folder.id, seen_folders)
        # Add the current parent folder to the list
        if indict:
            parent_folders.append(fx_repair(
                {**parent_folder.to_dict(), 'fx': folder_fxs_entry.to_dict()}, 'Folder'))
        else:
            parent_folders.append(
                fx_repair({'folder': parent_folder, 'fx': folder_fxs_entry}, 'Folder'))
        # Combine all parent folders
        all_parent_folders.extend(parent_folders)
    return all_parent_folders


def its_included(collection, item_id, field_name='id'):
    if isinstance(collection, list) and any(item[field_name] == item_id for item in collection):
        return True
    return False


def get_folder_tree(folder_id):
    folder = Folder.query.get_or_404(folder_id)
    # Get the immediate subfolders, texts, files
    subfoldersfxs = FolderFxS.query.filter_by(
        parent_id=folder_id, type='Folder').all()
    textsfxs = FolderFxS.query.filter_by(
        parent_id=folder_id, type='Text').all()
    filesfxs = FolderFxS.query.filter_by(
        parent_id=folder_id, type='File').all()

    subfolders = [
        fx_repair({'fx': subfolder.to_dict(), **
                  Folder.query.get(subfolder.folder_id).to_dict()}, 'Folder')
        for subfolder in subfoldersfxs
    ]
    texts = [
        fx_repair({'fx': text.to_dict(), **
                  Text.query.get(text.text_id).to_dict()}, 'Text')
        for text in textsfxs
    ]
    files = [
        fx_repair({'fx': file.to_dict(), **
                  File.query.get(file.file_id).to_dict()}, 'File')
        for file in filesfxs
    ]

    folder_structure = fx_repair(
        {**folder.to_dict(), 'children': []}, 'Folder')
    # Add texts and files to the children
    folder_structure['children'].extend(texts)
    folder_structure['children'].extend(files)

    # Recursively add subfolders to the children
    for subfolder in subfolders:
        subfolder_tree = get_folder_tree(subfolder['id'])
        folder_structure['children'].append(subfolder_tree)
    return folder_structure


def find_tree_child_by_name(folder_structure, name, type):
    """
    Recursively search for a folder, file, or text by name and type in the folder structure.
    """
    # Base case: check if the current folder or its children match the name and type
    if folder_structure['fx']['name'] == name and folder_structure['fx']['type'] == type:
        return folder_structure

    # Recursively check in the children
    for child in folder_structure.get('children', []):
        result = find_tree_child_by_name(child, name, type)
        if result:
            return result
    return None


def handle_text_exclusion(fxs: FolderFxS):
    """Handle the exclusion of a text."""
    text: Text = Text.query.get_or_404(fxs.text_id)
    # Check if the text is only referenced once
    is_not_referenced = FolderFxS.query.filter_by(
        text_id=fxs.text_id).count() == 1

    # If the text is not public and not referenced elsewhere, delete it
    if is_not_referenced and text.private:
        db.session.delete(text)

    # Always delete the FolderFxS entry
    db.session.delete(fxs)


def handle_file_exclusion(fxs: FolderFxS):
    """Handle the exclusion of a file."""
    # Remove the FolderFxS entry for the file
    db.session.delete(fxs)


def handle_folder_exclusion(fxs: FolderFxS):
    """Handle the exclusion of a folder and its contents."""
    folder: Folder = Folder.query.get_or_404(fxs.folder_id)

    # Check how many parents the folder has
    parent_count = FolderFxS.query.filter_by(folder_id=folder.id).count()

    if parent_count > 1:
        # Folder has other parents, just remove the FolderFxS entry
        db.session.delete(fxs)
    else:
        # Only has the current parent; need to delete the folder and its contents recursively
        remove_folder_and_contents(folder)
        db.session.delete(fxs)


def remove_folder_and_contents(folder: Folder):
    """Recursively remove a folder and its contents, ensuring no other parent references."""
    subfolders = FolderFxS.query.filter_by(
        parent_id=folder.id, type='Folder').all()
    files = FolderFxS.query.filter_by(parent_id=folder.id, type='File').all()
    texts = FolderFxS.query.filter_by(parent_id=folder.id, type='Text').all()

    # Delete subfolders
    for subfolder_fxs in subfolders:
        subfolder = Folder.query.get_or_404(subfolder_fxs.folder_id)
        parent_count = FolderFxS.query.filter_by(
            folder_id=subfolder.id).count()

        if parent_count == 1:
            remove_folder_and_contents(subfolder)
        db.session.delete(subfolder_fxs)

    # Delete files
    for file_fxs in files:
        file = File.query.get_or_404(file_fxs.file_id)
        parent_count = FolderFxS.query.filter_by(file_id=file.id).count()

        if parent_count == 1:
            db.session.delete(file)
        db.session.delete(file_fxs)

    # Delete texts
    for text_fxs in texts:
        text = Text.query.get_or_404(text_fxs.text_id)
        parent_count = FolderFxS.query.filter_by(text_id=text.id).count()

        if parent_count == 1 and text.private:
            db.session.delete(text)
        db.session.delete(text_fxs)

    # Finally, delete the folder itself
    db.session.delete(folder)


def add_folder_to_zip(zip_file, folder, base_path=''):
    # Get all files and texts in the folder
    files_objs = get_child_files(folder.id)
    texts = get_child_texts(folder.id)

    # Add files to the zip
    for file in files_objs:
        file_path = os.path.join(base_path, file['file'].filename)
        # Assuming File model has a binary content field for file data
        zip_file.writestr(file_path, file['file'].data)

    # Add texts to the zip (if they are to be included)
    for text in texts:
        text_path = os.path.join(
            base_path, unique_name(text['text'].file_type))
        # Assuming Text model has a `content` field
        zip_file.writestr(text_path, text['text'].content)

    # Recursively add subfolders
    subfolders = get_child_subfolders(folder.id)
    for subfolder in subfolders:
        add_folder_to_zip(zip_file, subfolder['folder'], os.path.join(
            base_path, subfolder['folder'].foldername))
