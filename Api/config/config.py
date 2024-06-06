import os
from dotenv import load_dotenv

load_dotenv()

#UPLOAD_FOLDER = (os.getcwd()) + '/db/UPLOADS'
#print(os.path.exists(UPLOAD_FOLDER), UPLOAD_FOLDER)
#if not os.path.exists(UPLOAD_FOLDER):
#    os.makedirs(UPLOAD_FOLDER)

class Config:
    if os.getenv("DB_TYP") == "mysql":
        SQLALCHEMY_DATABASE_URI ="mysql+mysqlconnector://{}:{}@{}/{}".format(
            os.getenv("DB_USER"),
            os.getenv("DB_PASSWORD"),
            os.getenv("DB_HOST"),
            os.getenv("DB"))
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///{}.db'.format(os.getenv("DB"))
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWK_SECRET_KEY')
    JWT_TOKEN_LOCATION = ['headers']
    JWT_COOKIE_SECURE = False
    #UPLOAD_PATH = UPLOAD_FOLDER
    MAX_CONTENT_LENGTH = 1024 * 1024

print(Config.SQLALCHEMY_DATABASE_URI)