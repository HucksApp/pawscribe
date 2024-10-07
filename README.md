# Pawscribe

Pawscribe is a robust, real-time Document, Project/Software development, Management and collaboration application built with Flask, Flask-Blueprint, Socket.IO, and JWT for authentication. It provides features such as file and script sharing, folder management, software development,  collaboration with live updates, and more.

## Features
###  Restful
  - User Authentication with JWT
  - File Upload and Management, Restful
  - Script Creation and management
  - Folder Creation and Management
  - Script and File Sharing with Private and Public Access
### Socket.IO
  - Real-time project/software (Folder, Files, Script, and data content) creation, mutation and synchronizing with database storage

### Hash-based Duplicate Detection for Files and Scripts
### MySQL Database Integration For Production and Sqlite for Development

## Technology Stack
- CORE: Flask, Flask-Blueprint
- ORM: Flask-SQLAlchemy
- Transport: Flask-Restful, Flask-SocketIO
- Authentication: Flask-JWT-Extended
- Database: MySQL, SQLite
- Others: hashlib, Docker, OS

## Project Structure

```plaintext
/Pawscribe
│
├── /api                     # Contains all the routes and API endpoints
│   ├── /auth.py             # Handles authentication (login, JWT tokens, etc.)
│   ├── /folders.py          # Folder management routes (create, delete, list folders)
│   ├── /files.py            # File management routes (upload, sync, etc.)
│   ├── /sync.py             # Sync-related routes to handle hash checking and content updates
│   └── ...
│
├── /db
|   |── /models                  # SQLAlchemy models representing the database schema
│       ├── /folder.py           # Folder model
│       ├── /file.py             # File model
│       ├── /user.py             # User model (for authentication)
│       └── ...
│
├── /services                # Business logic and helper functions for the app
│   ├── /hash_service.py     # Helper functions for handling hash generation and checking
│   ├── /file_service.py     # Logic for file upload, sync, and version control
│   └── ...
│
├── /config.py               # Application configuration (DB connection, JWT settings, etc.)
│
└── README.md                # Backend-specific README
```



Setup and Installation
Clone the Repository

git clone https://github.com/yourusername/Pawscribe.git
cd Pawscribe


Usage
Authentication
Register a new user at /register
Login at /login
File and Folder Management
Upload files and create folders at /
Real-time Collaboration
Collaborate on text documents in real-time at /collaborate
Sharing
Share files and text documents via generated URLs
API Endpoints
Auth Routes

POST /api/v1/auth/login
POST /api/v1/auth/register
File Routes

POST /api/v1/files/upload
GET /api/v1/files/download/<file_id>
DELETE /api/v1/files/<file_id>
Text Routes

POST /api/v1/text/create
GET /api/v1/text/<text_id>
DELETE /api/v1/text/<text_id>
