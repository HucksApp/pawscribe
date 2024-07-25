import docker

client = docker.from_env()

def create_docker_environment(language):
    if language == "python":
        container = client.containers.run("python:3.8-slim", detach=True, tty=True)
    elif language == "c":
        container = client.containers.run("gcc:latest", detach=True, tty=True)
    elif language == "node":
        container = client.containers.run("node:14", detach=True, tty=True)
    else:
        raise ValueError("Unsupported language")
    return container

def execute_code(container, code):
    exit_code, output = container.exec_run(code)
    return exit_code, output.decode()

def clean_up_container(container):
    container.stop()
    container.remove()