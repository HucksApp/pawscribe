"""
Module: Docker Environment Management

This module provides functions to manage Docker environments for various programming languages.
It includes the creation of Docker containers, execution of code within these containers,
and cleanup of the container resources. Supported languages include Python, JavaScript, Bash, and C.

Dependencies:
- docker: Python library to interact with the Docker API.
- os: Provides a way of using operating system-dependent functionality.
- shutil: Offers a higher-level interface for file operations.
- uuid: Generates unique identifiers.

Usage:
- Use `create_docker_environment` to create a new Docker container based on the specified programming language.
- Use `execute_code` to run a specific entry point script within the Docker container.
- Use `execute_command` to run arbitrary commands in the container, handling directory changes.
- Use `clean_up_container` to stop and remove the container and delete associated temporary directories.
"""

import docker
import os
import shutil
import uuid


def create_docker_environment(language, temp_dir, user_id):
    """
    Create a Docker container and mount the temporary directory as a volume.
    Ensures the correct image is pulled for the selected language.

    Parameters:
    - language (str): The programming language for which the environment is created.
    - temp_dir (str): The path to the temporary directory to be mounted as a volume.
    - user_id (str): The unique identifier of the user creating the container.

    Returns:
    - container: The created Docker container instance.

    Raises:
    - ValueError: If the specified language is not supported.
    - RuntimeError: If there is an error pulling the Docker image or creating the container.
    """
    image_map = {
        'python': {'image': 'python:3.9-slim', 'cmd': 'python'},
        'javascript': {'image': 'node:16-alpine', 'cmd': 'node'},
        'bash': {'image': 'alpine', 'cmd': '/bin/sh'},
        'c': {'image': 'gcc:latest', 'cmd': '/bin/bash'},
        # Add more languages and corresponding Docker images as needed
    }

    # Validate language
    if language not in image_map:
        raise ValueError(f"Language '{language}' is not supported")

    image = image_map[language]['image']
    default_cmd = image_map[language]['cmd']
    client = docker.from_env()

    # Generate a unique name for the container, incorporating the user ID
    container_name = f"{language}_container_{user_id}_{uuid.uuid4().hex[:8]}"

    try:
        client.images.pull(image)
    except docker.errors.ImageNotFound:
        raise ValueError(f"Image {image} not found.")
    except docker.errors.APIError as e:
        raise RuntimeError(f"Error pulling Docker image: {str(e)}")

    try:
        container = client.containers.create(
            image=image,
            command=default_cmd,
            name=container_name,  # Assign a dynamic name with user ID
            stdin_open=True,
            tty=True,
            volumes={temp_dir: {'bind': '/app', 'mode': 'rw'}},
            working_dir='/app',
            detach=True,
            mem_limit='512m',
            cpu_shares=512
        )
        container.start()
        return container

    except docker.errors.APIError as e:
        raise RuntimeError(f"Error creating Docker container: {str(e)}")


def execute_code(container, entry_point, language):
    """
    Execute the specified code file within the Docker container.

    Parameters:
    - container: The Docker container instance in which to execute the code.
    - entry_point (str): The entry point script to execute.
    - language (str): The programming language of the entry point.

    Returns:
    - tuple: (exit_code, output) of the execution.

    Raises:
    - ValueError: If no command is found for the specified language.
    """
    command_map = {
        'python': f"python {entry_point}",
        'javascript': f"node {entry_point}",
        'bash': f"/bin/sh {entry_point}",
        'c': f"gcc {entry_point} -o output && ./output",
    }

    # List files in the directory inside the container to debug volume mount issues
    list_files_command = f"ls -l {os.path.dirname(entry_point)}"
    try:
        exit_code, file_list = container.exec_run(
            f"/bin/sh -c '{list_files_command}'")
        # Now check if the entry point exists after confirming the directory
        command = command_map.get(language)
        if not command:
            raise ValueError(f"No command found for language '{language}'")

        exit_code, output = container.exec_run(f"/bin/sh -c '{command}'")
        return exit_code, output.decode()
    except Exception as e:
        raise


def execute_command(container, command, cwd=None, current_user_id=None):
    """
    Execute an arbitrary command within the Docker container, handling directory changes.

    Parameters:
    - container: The Docker container instance.
    - command (str): The command to execute.
    - cwd (str | None): The current working directory; defaults to '/app' if None.
    - current_user_id (str | None): The ID of the current user.

    Returns:
    - tuple: (exit_code, output, cwd, cwd_id) where cwd_id is the last component of the current path.

    Raises:
    - Exception: If there is an error executing the command.
    """
    from ..store.manager import container_manager
    try:
        if cwd is None:
            cwd = '/app'  # Default working directory

        full_command = f"cd {cwd} && {command}"
        exit_code, output = container.exec_run(f"/bin/sh -c '{full_command}'")

        # Handle directory changes
        if command.startswith('cd ') and exit_code == 0:
            new_cwd_parts = command.split('cd', 1)[-1].strip()
            new_cwd = os.path.normpath(os.path.join(cwd, new_cwd_parts))

            # Check if the directory exists in the container
            try:
                # Just to check if it exists
                container.exec_run(f"ls {new_cwd}")
                cwd = new_cwd
                # Update active container cwd and cwd_id
                if current_user_id:
                    container_manager.active_containers[current_user_id]['cwd'] = cwd
                    print("cwd name ===>",cwd)
            except Exception:
                print(f"Directory {
                      new_cwd} does not exist. Keeping old cwd: {cwd}")

        return exit_code, output.decode(), cwd

    except Exception as e:
        print(f"Error executing command in container: {str(e)}")
        raise


def clean_up_container(container, temp_dir):
    """
    Stop and remove the Docker container and delete the temporary directory.

    Parameters:
    - container: The Docker container instance to clean up.
    - temp_dir (str): The path to the temporary directory to delete.

    Raises:
    - Exception: If there is an error during cleanup.
    """
    try:
        if container.status == 'running':
            container.stop()
            container.remove()
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
    except Exception as e:
        print(f"Error during container cleanup: {str(e)}")
        raise
