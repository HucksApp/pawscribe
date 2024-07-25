
from typing import List
from db.models.text import Text
from db.models.file import File
from db.models.folder import Folder
from db.models.folderfxs import FolderFxS
from Api.__init__ import db

def remove_all_strictly(folder: Folder) -> None:
    #remove all text script if its no longer referenced
    isnotaref = len(FolderFxS.query.filter_by(folder_id=folder.id)) <= 1
    isnotaparent = len(FolderFxS.query.filter_by(parent_id=folder.id)) <= 1
    if isnotaref and isnotaparent:
        folderlist = find_all_subfolder(folder)
        for fold in folderlist:
            textlist:List[Text] = FolderFxS.query.filter_by(type='Text', parent_id=fold.text_id).all()
            for ftext in textlist:
                isnotaref = len(FolderFxS.query.filter_by(type='Text', text_id=ftext.text_id).all()) <= 1
                if isnotaref:
                    text:Text = Text.query.get_or_404(ftext.text_id)
                    db.session.delete(text)
                    db.session.delete(ftext)
            isnotaref = len(FolderFxS.query.filter_by(folder_id=fold.folder_id)) <= 1
            isnotaparent = len(FolderFxS.query.filter_by(parent_id=fold.folder_id)) <= 1
            if isnotaref and isnotaparent:
                del_folder:Folder = Folder.query.get_or_404(fold.folder_id)
                db.session.delete(del_folder)
                db.session.delete(fold)


def find_all_subfolder(folder: Folder) -> List[FolderFxS]:
    #find all subfolders of a folder <Folderfxs>
    folderlist:List[Folder] = []
    filterlist:List[Folder] = []
    subfolderslist:List[Folder] 
    subfolders:list[FolderFxS] = FolderFxS.query.filter_by(type='Folder', parent_id=folder.id).all()
    is_end_folder:bool =  False
    filterlist = [*subfolders]
    while not is_end_folder:
        for fold in filterlist:
            flist = FolderFxS.query.filter_by(type='Folder', parent_id=fold.folder_id).all()
            folderlist.extend(flist)
            subfolderslist.extend(flist)
        if len(subfolderslist) != 0:
            filterlist.clear()
            filterlist = [*subfolderslist]
            subfolderslist.clear()
        else:
            is_end_folder = True
    return folderlist
    
def get_all_texts(folder: Folder) -> List[dict[Text, FolderFxS]]:
    subfolders = find_all_subfolder(folder)
    texts: List[dict[Text, FolderFxS]] = []
    for fold in subfolders:
        #get texts 
        textlist:List[FolderFxS] = FolderFxS.query.filter_by(type='Text', parent_id=fold.text_id).all()
        for ftext in textlist:
            text:Text = Text.query.get_or_404(ftext.text_id)
            texts.append({'text': text.to_dict(), 'folderfxs': fold.to_dict()})
    return texts


def get_all_files(folder: Folder) -> List[dict[File | FolderFxS]]:
    #get  all files <File> of a folder
    subfolders = find_all_subfolder(folder)
    files: List[dict[File | FolderFxS]] = []
    for fold in subfolders:
        filelist:List[File] = File.query.filter_by(type='File', file_id=fold.file_id).all()
        for ffile in filelist:
            file:File = File.query.get_or_404(ffile.file_id)
            files.append({'file': file.to_dict(), 'folderfxs': fold.to_dict()})
    return files

def get_all_folders(folder: Folder) -> List[dict[Folder , FolderFxS]]:
    # get all sub folders <Folder> of a folder
    subfolders = find_all_subfolder(folder)
    folders:List[Text | FolderFxS] = []
    for fold in subfolders:
        #get texts 
        folderlist:List[FolderFxS] = FolderFxS.query.filter_by(type='Folder', parent_id=fold.folder_id).all()
        for ffolder in folderlist:
            folder_obj:Folder = Folder.query.get_or_404(ffolder.folder_id)
            folders.append({'folder': folder_obj.to_dict(), 'folderfxs': fold.to_dict()})
    return folders


def get_all_children(folder: Folder) -> dict[Folder | File | FolderFxS]:
    # get all files <File>, texts <Text> and sub folders <Folder> of a folder
    files = get_all_files(folder)
    texts = get_all_texts(folder)
    folders = get_all_folders(folder)
    return {'files':files, 'texts': texts, "sub_folders": folders}