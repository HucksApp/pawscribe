# Pawscribe Client (Frontend)
Pawscribe is a dynamic, real-time document, project/software development, and coding collaboration application. The frontend is built with React.js, enabling intuitive file, folder, and project management with live updates and collaboration features.
## 🧰 Features
### UI/UX 📱⇢💻
* Document/File and Script Viewer
* File Upload and Folder Management
* Real-time coding Collaboration, with real time project data update
* Interactive Code and Script Editor
* Integrated Development Enviroment (IDE)
### API Integration 🚀
- Connects with the Pawscribe API (Backend)
- Folder, Files, and Script Synchronization
- WebSocket and HTTP Communication for Real-time data creation and mutation.
### Frontend Technology Stack 📚
* Framework: React.js
* State Management: Redux
* Caching: Local storage
* WebSockets: Socket.IO
* HTTP: Axios
* Library: Material-UI, Framer-motion, Monaco
* Styling: CSS, Material-UI
## ⛩ Project Structure
```
📁 /Pawscribe_Client/
│
├──📁 /public/                                # Public static files (HTML, icons)
│     └──📄 ....html, .ico, .txt              # All jsx component files
├──📁 /src/                                   # Main source code for the frontend
│     ├──📁 /components/                      # Reusable UI components 
│     │     └──📄 ....jsx                     # All jsx component files
│     ├──📁 /css/                             # components css files
│     │     └──📄 ....css                     # All in-app css files
│     ├──📁 /images/                          # contain all static images
│     │     └──📄 ....svg,.jpg                # all static images
│     ├──📁 /utils/                           # All utility and helper Functions
│     │     ├──📄 /Notification.js            # Notification Function
│     │     ├──📄 /codeIcon.js                # Language icon picker
│     │     ├──📄 /formatter.js               # Data formatter for A UI component
│     │     ├──📄 /hash.js                    # Hash function for data hashing and comparation to detect changes
│     │     ├──📄 /projectBlob.js             # fetch file blob function (sync)
│     │     └──📄 /transport.js               # socket transport funtion
│     ├──📁 /store/                           # State and cache data management
│     │     ├──📄 /cache.js                   # cache data management
│     │     ├──📄 /store.js                   # Main application entry point
│     │     ├──📄 /queue.js                   # Cache data management for unsave(backend) data persistency
│     │     ├──📄 /fileBlobSlice.js           # file data Blob slice
│     │     ├──📄 /fileSlice.js               # file data slice
│     │     ├──📄 /folderSlice.js             # folder data slice
│     │     ├──📄 /textSlice.js               # Script data slice
│     │     ├──📄 /projectSlice.js            # Project  data slice
│     │     └──📄 /userSlice.js.js            # User data slice
│     ├──📄 /App.js                           # Main application entry point
│     └──📄 /index.js                         # React entry point
│
├──📄 /.env                                   # Environment variables for API and socket connections
├──📄 /.eslintrc                              # Linting configuration for ESLint
├──📄 /.prettierrc                            # Formatting configuration for Prettier
├──📄 /README.md                              # Frontend-specific README
├──📄 /package.json                           # Project dependencies and scripts
├──📄 /package-lock.json                      # Lock file for exact package versions
├──📄 /init.sh                                # Script for project setup and environment configuration
└──📄 /config-overrides.js                    # Configuration overrides for Webpack (if used)

```

## Installation ⬇️
```
$ git clone --single-branch --branch pawscribe_client https://github.com/HucksApp/pawscribe.git
$ cd pawscribe/client
$ npm install
$ npm start

```
