import os
import datetime
import uuid 


def generate_key():
    return str(uuid.uuid4())



def unique_rename(file):
    file_name = file.filename
    dt = str(datetime.datetime.now())
    name_struct = os.path.splitext(file_name)
    base_name = name_struct[0]
    extension = name_struct[1]
    new_name = base_name + '_' + dt + '_' + extension
    file.filename = new_name
    return new_name