from flask import Blueprint, request, jsonify
from flask_socketio import emit
from Api import socketio
from ..utils.docker_env import create_docker_environment, execute_code, clean_up_container

run_bp = Blueprint('run', __name__, url_prefix='run')


@run_bp.route('/', methods=['POST'])
def run_code():
    data = request.get_json()
    language = data.get('language')
    code = data.get('code')
    msg = {'message': "", "valid": False}

    if not language or not code:
        msg.update({"message": "Language and code are required"})
        return jsonify(msg), 400

    container = create_docker_environment(language)
    exit_code, output = execute_code(container, code)
    clean_up_container(container)
    msg.update({"message": f' run exit with {'success' if exit_code == 0 else 'failure'}', "exit_code": exit_code, "output": output, "valid": True})
    return jsonify(msg), 200


@socketio.on('run_code')
def handle_run_code(data):
    language = data.get('language')
    code = data.get('code')
    msg = {'message': "", "valid": False}

    if not language or not code:
        msg.update({"message": "Language and code are required"})
        emit('code_result', msg, 400)
        return
    container = create_docker_environment(language)
    exit_code, output = execute_code(container, code)
    clean_up_container(container)
    msg.update({"message": f' run exit with {'success' if exit_code == 0 else 'failure'}', "exit_code": exit_code, "output": output, "valid": True})
    emit('code_result', msg, 200)
