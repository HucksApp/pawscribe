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
Connects with the Pawscribe API (Backend)
Folder, Files, and Script Synchronization
WebSocket and HTTP Communication for Real-time data creation and mutation.
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
│     ├──📁 /utils/                           # API service functions for HTTP requests
│     │     ├──📄 /Notification.js            # Main application entry point
│     │     ├──📄 /codeIcon.js                # Main application entry point
│     │     ├──📄 /formatter.js               # Main application entry point
│     │     ├──📄 /hash.js                    # Main application entry point
│     │     ├──📄 /projectBlob.js             # Main application entry point
│     │     └──📄 /transport.js               # Main application entry point
│     ├──📁 /store/                           # Redux store configuration and slices
│     │     ├──📄 /cache.js                   # Main application entry point
│     │     ├──📄 /store.js                   # Main application entry point
│     │     ├──📄 /queue.js                   # Main application entry point
│     │     ├──📄 /fileBlobSlice.js           # Main application entry point
│     │     ├──📄 /fileSlice.js               # Main application entry point
│     │     ├──📄 /folderSlice.js             # Main application entry point
│     │     ├──📄 /textSlice.js               # Main application entry point
│     │     ├──📄 /projectSlice.js            # Main application entry point
│     │     └──📄 /userSlice.js.js            # Main application entry point
│     ├──📄 /App.js                           # Main application entry point
│     └──📄 /index.js                         # React entry point
│
├──📄 /.env                                   # Environment variables for API and socket connections
├──📄 /.eslintrc                              # Environment variables for API and socket connections
├──📄 /.prettierrc                            # Environment variables for API and socket connections
├──📄 /README.md                              # Frontend-specific README
├──📄 /package.json                           # Project dependencies and scripts
├──📄 package-lock.json                       # Project dependencies and scripts
├──📄 /README.md                              # Frontend-specific README
├──📄 /init.sh                                # Project dependencies and scripts
└──📄 /config-overrides.js                    # Webpack configuration (if used)

```

## Installation ⬇️
```
$ git clone --single-branch --branch pawscribe_client https://github.com/HucksApp/pawscribe.git
$ cd pawscribe/client
$ npm install
$ npm start

```
