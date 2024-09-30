"""
This blueprint handles terminal operations for users, including starting containers, executing code, running shell commands, and closing containers.
It leverages Docker to create isolated environments for users to run code or commands securely.
"""

import tempfile
from flask import Blueprint
from flask_socketio import emit
from Api import socketio
from ..utils.docker_env import create_docker_environment, execute_code, clean_up_container, execute_command
from ..utils.run_utility import determine_entry_point, clean_temp_dir
from ..utils.required import token_required
from ..store.manager import container_manager
from db.models.folder import Folder
from db.models.file import File
from db.models.text import Text
from ..utils.data_sync import handle_mkdir_command, handle_move_or_copy_command, handle_touch_command, handle_rm_command
import os
import re

# Define Blueprint for 'run' operations
run_bp = Blueprint('run', __name__, url_prefix='/run')


@socketio.on('start_terminal')
@token_required
def handle_start_terminal(current_user, data):
    """
    Starts a terminal for the user by creating a Docker container in the specified language.

    Input (via WebSocket):
    - parent_folder_id: ID of the parent folder if applicable.
    - entry_point_id: ID of the entry point for execution.
    - type: Type of the execution environment ('file' or 'folder').
    - language: Programming language (required).

    Output (via WebSocket):
    - Emits a success message if the terminal starts successfully, otherwise an error message.

    Steps:
    - Manage the user’s container to ensure only one active container.
    - Create a temporary directory for the user’s session.
    - Determine the entry point based on the folder or file.
    - Create a Docker container for the user's specified language environment.
    """
    parent_folder_id = data.get('parent_folder_id')
    entry_point_id = data.get('entry_point_id')
    type = data.get('type')
    language = data.get('language')
    container_type = 'folder' if parent_folder_id else type

    if not language:
        emit('start_terminal', {'message': 'Language is required'}, 400)
        return

    try:
        # Ensure only one container per user
        container_manager.manage_user_container(current_user.id)

        # Create a temporary directory for the user
        temp_dir = tempfile.mkdtemp()

        # Determine the entry point (file or folder)
        entry_point = determine_entry_point(
            parent_folder_id, current_user.id, entry_point_id, type, temp_dir)

        # Create the Docker container environment
        container = create_docker_environment(
            language, temp_dir, user_id=current_user.id)

        # Store container info in the active containers
        container_manager.active_containers[current_user.id] = {
            'container': container,
            'temp_dir': temp_dir,
            'language': language,
            'type': container_type,
            'id': parent_folder_id or entry_point_id,
            'cwd': container_manager.container_root,
            'project_id': parent_folder_id
        }

        # Notify the user that the terminal was started successfully
        emit('start_terminal', {
             'message': 'Terminal started successfully', 'status': 200, 'valid': True})

    except Exception as e:
        print(e)
        emit('start_terminal', {'message': str(e), 'status': 500})


@socketio.on('run_code')
@token_required
def handle_run_code(current_user, data):
    """
    Executes code in the user's active Docker container.

    Input (via WebSocket):
    - parent_folder_id: ID of the parent folder for the code (optional if executing a single script).
    - entry_point_id: ID of the entry point file for execution (optional if executing a single script).
    - type: Type of the environment (file or folder).
    - language: Programming language (required).
    - code: The code content itself (optional, required if no parent_folder_id).

    Output (via WebSocket):
    - Emits the result of the code execution, including exit code and output.

    Steps:
    - If no parent_folder_id is provided, treat the code as a direct script.
    - Check if there’s an active container for the user; if not, create one.
    - Execute the code inside the container and return the result.
    """
    parent_folder_id = data.get('parent_folder_id')
    entry_point_id = data.get('entry_point_id')
    type = data.get('type')
    language = data.get('language')
    # Get the script content if no parent_folder_id is provided
    code = data.get('code')

    if not language:
        emit('code_result', {'message': 'Language is required'}, 400)
        return

    try:
        # Retrieve the active container for the user
        container_info = container_manager.active_containers.get(
            current_user.id)

        # Define temp_dir and entry point variables
        temp_dir = None
        entry_point = None
        entry_point_path = None

        # Create a new container if none exists or if the language/type doesn't match
        if not container_info or container_info['language'] != language or container_info['type'] != type:
            container_manager.manage_user_container(current_user.id)
            temp_dir = tempfile.mkdtemp()

            container = create_docker_environment(
                language, temp_dir, user_id=current_user.id)

            # Store new container info
            container_manager.active_containers[current_user.id] = {
                'container': container,
                'temp_dir': temp_dir,
                'language': language,
                'type': type,
                'cwd': container_manager.container_root,
                'project_id': parent_folder_id
            }
        else:
            container = container_info['container']
            temp_dir = container_info['temp_dir']

        # If no parent_folder_id is provided, treat the code as a direct script
        if not parent_folder_id:
            # Create a temporary file for the code in the container's temp directory
            # Adjust the extension based on the language
            script_file_name = 'doc'
            if type == 'file':
                file = File.query.get_or_404(entry_point_id)
                script_file_name = file.filename
            if type == 'text':
                text = Text.query.get_or_404(entry_point_id)
                script_file_name = f"temp_script.{text.file_type}"

            script_path = os.path.join(temp_dir, script_file_name)

            # Write the provided code to the temporary file
            with open(script_path, 'w') as script_file:
                script_file.write(code)

            # Adjust entry_point_path to this new file
            entry_point_path = script_path.replace(
                temp_dir, container_manager.container_root)
        else:
            # Determine the entry point for both new and existing containers if a folder is provided
            entry_point, entry_point_path = determine_entry_point(
                parent_folder_id, current_user.id, entry_point_id, type, temp_dir)
            entry_point_path = entry_point_path.replace(
                temp_dir, container_manager.container_root)

        # Execute the code inside the Docker container
        exit_code, output = execute_code(container, entry_point_path, language)

        # Emit the result of the code execution
        emit('code_result', {
            'message': f'Execution {"succeeded" if exit_code == 0 else "failed"}',
            'exit_code': exit_code,
            'output': output,
            'status': 200
        })

    except Exception as e:
        emit('code_result', {'message': str(e), 'status': 500})


@socketio.on('send_command')
@token_required
def handle_send_command(current_user, data):
    """
    Executes shell commands inside the user's active Docker container.

    Input (via WebSocket):
    - command: The shell command to execute (required).

    Output (via WebSocket):
    - Emits the result of the command execution, including the exit code and output.

    Steps:
    - Parse the command and handle specific cases (touch, mv, cp, mkdir).
    - Run the command in the Docker container and return the result.
    """
    command = data.get('command')
    if not command:
        emit('error_result', {
             'message': 'Command is required', 'status': 400})
        return

    # Retrieve the active container info for the user
    container_info = container_manager.active_containers.get(current_user.id)
    if not container_info:
        emit('error_result', {
             'message': 'No active container found for user', 'status': 404})
        return

    try:
        container = container_info['container']
        cwd = container_info.get('cwd', container_manager.container_root)
        temp_dir = container_info.get('temp_dir')
        mapRoot = cwd.replace(container_manager.container_root, temp_dir)

        # Wild Card Not Yet Supported
        if '*' in command and any(substring in command for substring in ['mkdir', 'rm', 'cd', 'mv', 'touch']):
            emit('info_result', {
                'exit_code': 1,
                'message': 'Use of wild card like *  is not yet supported for '
                'structure : create, remove, alter, navigate',
                'status': 400
            })
            return

        # Handle compound commands separated by '; &&, '
        tasks = re.split('; &&, ', command)
        for task in tasks:
            project_id = container_info['project_id']
            cwd = container_info['cwd']
            project = Folder.query.get(project_id)
            if any(cmd in task for cmd in ['mv', 'mkdir', 'rm', 'touch']) and (not project_id or (project and project.foldername not in cwd)):

                emit('error_result', {
                    'exit_code': 1,
                    'message': 'Use  structure : create, remove, alter, navigate'
                    ' in a None Project Folder root is not allowed',
                    'status': 400
                })
                return
             # Handle touch, mv/cp, and mkdir <structure mutation> commands specifically
            reconstruction_task = None
            if task.startswith("touch "):
                reconstruction_task = handle_touch_command(
                    task, current_user.id)
                if reconstruction_task:
                    command = command.replace(task, reconstruction_task)
            elif task.startswith("mv ") or task.startswith("cp "):
                reconstruction_task = handle_move_or_copy_command(
                    task, current_user.id)
            elif task.startswith("mkdir "):
                reconstruction_task = handle_mkdir_command(
                    task, current_user.id)
            elif task.startswith("rm "):
                reconstruction_task = handle_rm_command(task, current_user.id)
        if reconstruction_task:
            emit('db_changed', {
                'message': 'Ui structure reconstruct',
                'exit_code': 0,
                'status': 200
            })
        # Execute the command in the Docker container
        exit_code, output, new_cwd_container = execute_command(
            container, command, cwd=cwd, current_user_id=current_user.id)
        # Update the container's working directory if it changed
        if new_cwd_container:
            container_manager.active_containers[current_user.id]['cwd'] = new_cwd_container

        # Emit the result of the command execution
        emit('command_result', {
            'message': f'Command {"succeeded" if exit_code == 0 else "failed"}',
            'exit_code': exit_code,
            'output': output,
            'status': 200
        })
    except Exception as e:
        emit('command_result', {'message': str(e), 'status': 500})


@socketio.on('close_container')
@token_required
def handle_close_container(current_user):
    """
    Closes the Docker container for the current user and cleans up the resources.

    Output (via WebSocket):
    - Emits a success message when the container is closed, or an error message if no container is active.

    Steps:
    - Retrieve the active container for the user.
    - Clean up the Docker container and temporary directory.
    """
    container_info = container_manager.active_containers.get(current_user.id)
    if not container_info:
        emit('close_result', {
             'message': 'No active container found for user', 'status': 404})
        return

    try:
        # Clean up the Docker container and the temporary directory
        clean_up_container(
            container_info['container'], container_info['temp_dir'])
        clean_temp_dir(container_info['temp_dir'])

        # Remove the container from the active container list
        del container_manager.active_containers[current_user.id]

        # Emit a success message
        emit('close_result', {
             'message': 'Container closed successfully', 'status': 200})

    except Exception as e:
        emit('close_result', {'message': str(e), 'status': 500})
