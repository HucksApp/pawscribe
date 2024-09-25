# Pawscribe

Pawscribe is a robust, real-time text and file collaboration application built with Flask, Socket.IO, and JWT for authentication. It provides features such as file sharing, folder management, text collaboration with live updates, and more.

## Features

- User Authentication with JWT
- File Upload and Management
- Folder Creation and Management
- Real-time Text Collaboration with Socket.IO
- Text and File Sharing with Private and Public Access
- Hash-based Duplicate Detection for Files and Texts
- MySQL Database Integration

## Technology Stack

- Backend: Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-SocketIO
- Frontend: HTML5, CSS3, JavaScript (ES6)
- Database: MySQL
- Other: Socket.IO for real-time collaboration, Python hashlib for hashing

## Project Structure

```plaintext
Pawscribe/
├── api/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── file.py
│   │   ├── folder.py
│   │   └── text.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── files.py
│   │   └── text.py
│   ├── utils/
│   │   └── hashing.py
│   └── app.py
├─
├── static/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── collaborate.js
│   │   ├── index.js
│   │   └── login.js
├── templates/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── collaborate.html
│   └── shared_files.html
├── .env
├── config.py
├── requirements.txt
└── README.md
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
