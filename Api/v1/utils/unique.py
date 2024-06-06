import os
import datetime
import uuid 


def generate_key():
    return str(uuid.uuid4())



def unique_name(file_type, filename=None):
    dt = str(datetime.datetime.now())
    base_name = filename if filename else 'doc'
    extension = file_type
    new_name = base_name + '_' + dt + '_' + extension
    return new_name