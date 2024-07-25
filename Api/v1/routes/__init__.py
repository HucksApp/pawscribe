from flask import Blueprint, request, jsonify, send_file
from flask_socketio import emit
from db.models.file import File
from db.models.text import Text
from db.models.folder import Folder
from db.models.folderfxs import FolderFxS
from Api.__init__ import db, socketio
from ..utils.required import token_required
from io import BytesIO
from datetime import datetime
import subprocess
import os
import tempfile
import shutil


socketio.on('execute_code')


@token_required
def handle_execute_code(current_user, data):
    language = data.get('language')
    code = data.get('code')
    folder_id = data.get('folder_id')
    folder = Folder.query.get_or_404(folder_id)
    if folder.owner_id != current_user.id:
        emit(
            'execution_result', {
                'message': 'Permission denied', 'valid': False})
        return

    result = run_code(language, code)
    emit('execution_result', {'result': result, 'valid': True})


def run_code(language, code):
    temp_dir = tempfile.mkdtemp()
    try:
        if language == 'python':
            file_path = os.path.join(temp_dir, 'script.py')
            with open(file_path, 'w') as f:
                f.write(code)
            result = subprocess.run(
                ['python3', file_path], capture_output=True, text=True)
        elif language == 'c':
            file_path = os.path.join(temp_dir, 'program.c')
            with open(file_path, 'w') as f:
                f.write(code)
            binary_path = os.path.join(temp_dir, 'program')
            compile_result = subprocess.run(
                ['gcc', file_path, '-o', binary_path], capture_output=True, text=True)
            if compile_result.returncode != 0:
                return compile_result.stderr
            result = subprocess.run(
                [binary_path], capture_output=True, text=True)
        elif language == 'javascript':
            file_path = os.path.join(temp_dir, 'script.js')
            with open(file_path, 'w') as f:
                f.write(code)
            result = subprocess.run(
                ['node', file_path], capture_output=True, text=True)
        else:
            return 'Unsupported language'

        return result.stdout if result.returncode == 0 else result.stderr
    finally:
        shutil.rmtree(temp_dir)
