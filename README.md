# Pawscribe (Backend)
Pawscribe is a robust, real-time Document, Project/Software development, Management and collaboration application built with Flask, Flask-Blueprint, Socket.IO, and 🔏 JWT for authentication. It provides features such as file and script sharing, folder management, software development, coding collaboration, code Testing and ...

## 🧰 Features
###  Restful 🎞 ⇢ 🎮 ⇠ 🎞
  - User Authentication with JWT
  - File Upload and Management
  - Script Creation and management
  - Folder Creation and Management
  - Script and File Sharing with Private and Public Access
### Socket.IO  🎞 ⇢ 🔌 ⇠ 🎞
  - Folder, Files, Script, and data content creation
  - Folder, Files, Script, and data content mutation
  - Folder, Files, Script, and data content deletion
  - Folder, Files, Script, and data content synchronizing with database storage
  - Project Docker Container for Code and Command execution

### Hash-based Duplicate Detection for Files and Scripts #️⃣(📃) 🔀 🗃
### MySQL Database Integration For Production and Sqlite for Development 🛢🔄

## Technology Stack 📚
- CORE: Flask, Flask-Blueprint
- ORM: Flask-SQLAlchemy
- Transport: Flask-Rest, Flask-SocketIO
- Authentication: Flask-JWT-Extended
- Database: MySQL, SQLite
- Others: hashlib, Docker, OS

## ⛩ Project Structure

```plaintext
📁/Pawscribe/
│
├──📁 /api/                                   # Contains all the routes and API endpoints, utilities
│     ├──📄 /__init__.py                      # App and App Extensions Configurations
│     ├──📄 /app.py                           # Starts App and register the API Version Blueprint
│     ├──📄 /debug.py                         # Development helper Functions
│     ├──📁 /Config/                          # Contains Core App Configuration
│     │     └──📄 /config.py                  # Core App Configuration 
│     └──📁 /V1/                              # Contain API Version 1 routes, endpoints and utilities 
│           ├──📁 /utils/                     # Contain Utilities and Helper Functions
│           │     ├──📄 /allowed.py           # Allowed  file types, language supports, ...
│           │     ├──📄 /data_sync.py         # Data sychronizing function  between the container and database
│           │     ├──📄 /docker_env.py        # Docker Containerizer Class
│           │     ├──📄 /required.py          # Token required function (Token parser)
│           │     ├──📄 /route_utility.py     # Rest Routes Utility helper functions
│           │     ├──📄 /route_utility2.py    # Rest Routes Utility helper functions
│           │     ├──📄 /run_utility.py       # Socket Routes Utility helper functions
│           │     └──📄 /unique.py            # unique name and id generator
│           ├──📁 /store/                     # Contain Docker Manager Class
│           │     └──📄 /manager.py           # Creation, Deletion and Mangement of docker containerizer
│           └──📁 /routes/                    # Contains all the routes and endpoints
│                ├──📄 /auth.py               # Handles authentication (login, JWT tokens, etc.)
│                ├──📄 /folders.py            # Folder management routes (create, delete, list folders)
│                ├──📄 /files.py              # File management routes (upload, sync, etc.)
│                ├──📄 /run.py                # code execution, command execution, create, delete, mutate all structure and data
│                ├──📄 /text.py               # Script management routes
│                └──📄 /user.py               # user data management routes
│
├──📁 /db/                                    # Contains all DataBase Models/schema, Declarations, Mapping
|     |──📄 /__init__.py                      # Initializes the Object Relational Mapping
|     └──📁 /models/                          # contains Db models representing the database schema
│           ├──📄 /__init__.py                # Register the database Schemas/Models
│           ├──📄 /base.py                    # Base model
│           ├──📄 /file.py                    # File model
│           ├──📄 /folder.py                  # Folder model
│           ├──📄 /folderfxs.py               # Folderfxs (folder's subfolders, children files and script) model
│           ├──📄 /text.py                    # Script Model
│           └──📄 /user.py                    # User model
│
├──📁 /tests                                  # Contain App Backend Tests
│     ├──📄 /test_auth.py                     # Test Authentication Routes
│     ├──📄 /test_conf.py                     # Test App Configuration
│     ├──📄 /test_files.py                    # Test Files Managament routes
│     ├──📄 /test_folders.py                  # Test Folder Management routes
│     └──📄 /test_text.py                     # Test Script Management routes
│
├──📄 /.env                                   # Enviroment Variables
├──📄 /DB_Mysql_Setup.sql                     # Mysql Database and Database User setup
├──📄 /docker.sh                              # Docker setup
├──📄 /init.sh                                # Application all configuration and all installation script
├──📄 /install.sh                             # application  pre and post requirement installation script
├──📄 /refresh.sh                             # remove app caches and development related caches
├──📄 /run.py                                 # Main App Entry Point
├──📄 /requirements.txt                       # Libraries and Dependencies
└──📄 /README.md                              # Backend-specific README
```


## Installation ⬇️
```

$ git clone --single-branch --branch pawscribe https://github.com/HucksApp/pawscribe.git
$ cd pawscribe
$ python3 -m venv $(pwd)/.venv    # create project enviroment 📦   
$ source $(pwd)/bin/activate      # activate enviroment
$ ./init.sh                       # install all dependencies and create needed setups 🗳
$ python3 run.py                  # start server

```


