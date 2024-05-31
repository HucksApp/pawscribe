import os

ALLOWED_EXTENSIONS = {'.txt', '.pdf', '.png', '.jpg', '.jpeg', '.gif'}

def allowed_file(filename,message):
    extension =  os.path.splitext(filename)[1]
    if extension in ALLOWED_EXTENSIONS:
        return True
    message.update({"message": "File Type is not suported"})
    return False