"""Docker Container Manager"""
from ..utils.run_utility import clean_temp_dir
from ..utils.docker_env import clean_up_container
from ..utils.docker_env import create_docker_environment
import docker
import uuid


class ContainerManager:
    """
    Class: ContainerManager
    This class manages Docker containers for users in the application. It ensures that each user has a unique container
    and handles the cleanup of any old or orphaned containers.

    Attributes:
    - active_containers (dict): A dictionary that holds active containers for users, mapping user IDs to container information.
    - container_root (str): The root directory in the Docker container.
    - client (docker.DockerClient): The Docker client for interacting with Docker containers.

    Methods:
    - manage_user_container(user_id): Ensure the user has only one active container, cleaning up any old containers.
    - cleanup_existing_docker_containers(user_id): Cleanup any Docker containers associated with the user ID that are not in memory.
    - cleanup_containers(): Clean up all active containers and orphaned Docker containers.
    - create_user_container(user_id, language, temp_dir): Create a new Docker container for the user.
    """

    def __init__(self):
        """Initializes the ContainerManager with an empty active container dictionary and a Docker client."""
        self.active_containers = {}
        self.container_root = '/app'
        self.client = docker.from_env()  # Docker client for container operations

    def manage_user_container(self, user_id):
        """
        Ensure the user has only one container. Clean up old containers (in memory and in Docker) if they exist.

        Parameters:
        - user_id (str): The ID of the user whose container is being managed.
        """
        # Check if the user already has an active container in memory
        if user_id in self.active_containers:
            container_info = self.active_containers.pop(user_id)
            clean_up_container(
                container_info['container'], container_info['temp_dir'])
            clean_temp_dir(container_info['temp_dir'])

        # Cleanup existing Docker containers by the user ID
        self.cleanup_existing_docker_containers(user_id)

    def cleanup_existing_docker_containers(self, user_id):
        """
        Cleanup Docker containers that match the user's ID but are not in memory.

        Parameters:
        - user_id (str): The ID of the user whose containers are being cleaned up.
        """
        containers = self.client.containers.list(
            all=True)  # List all containers
        for container in containers:
            if user_id in container.name:  # If the container name contains the user_id
                print(f"Cleaning up container {
                      container.name} for user {user_id}")
                container.stop()
                container.remove()

    def cleanup_containers(self):
        """
        Clean up all active containers and search for any orphaned Docker containers.
        """
        print("Cleaning up all Docker containers...")
        for user_id, container_info in self.active_containers.items():
            container = container_info['container']
            temp_dir = container_info['temp_dir']
            clean_up_container(container, temp_dir)
            clean_temp_dir(temp_dir)
        self.active_containers.clear()

        # Clean up orphaned Docker containers
        containers = self.client.containers.list(all=True)
        for container in containers:
            if "container_" in container.name:  # Assuming containers are named with this pattern
                print(f"Cleaning up orphaned container: {container.name}")
                container.stop()
                container.remove()

    def create_user_container(self, user_id, language, temp_dir):
        """
        Create a new Docker container for the user and language, ensuring uniqueness.

        Parameters:
        - user_id (str): The ID of the user for whom the container is being created.
        - language (str): The programming language to set up in the container.
        - temp_dir (str): Temporary directory for container operations.

        Returns:
        - container: The created Docker container instance.
        """
        container_name = f"container_{user_id}_{uuid.uuid4().hex[:8]}"
        container = create_docker_environment(
            language, temp_dir, container_name)
        self.active_containers[user_id] = {
            'container': container,
            'temp_dir': temp_dir,
            'language': language,
            'cwd': self.container_root  # Set working directory to root
        }
        return container


# Instantiate the manager
container_manager = ContainerManager()
