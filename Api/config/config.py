"""App Configuration Class"""
import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables from a .env file
load_dotenv()


class Config:
    """
    Configuration class for setting up the application environment variables and Flask settings.
    This class handles database configuration, JWT setup, and other application-level settings.
    """

    # Set the SQLAlchemy database URI based on the database type (MySQL or SQLite)
    if os.getenv("DB_TYP") == "mysql":
        SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{}:{}@{}/{}".format(
            os.getenv("DB_USER"),
            os.getenv("DB_PASSWORD"),
            os.getenv("DB_HOST"),
            os.getenv("DB")
        )
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///{}.db'.format(os.getenv("DB"))

    # Secret key for session management
    SECRET_KEY = os.getenv('SECRET_KEY')

    # Disable modification tracking for SQLAlchemy (performance improvement)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configuration: secret key and token location
    JWT_SECRET_KEY = os.getenv('JWK_SECRET_KEY')
    JWT_TOKEN_LOCATION = ['headers']

    # JWT token expiration time
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=3)

    # JWT cookies will not be transmitted over HTTPS
    JWT_COOKIE_SECURE = False

    # Maximum allowed request content length (1 MB)
    MAX_CONTENT_LENGTH = 1024 * 1024
print(f'DataBase URL', Config.SQLALCHEMY_DATABASE_URI)