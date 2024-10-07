# 🐾 🐾 🐾 Pawscribe 🐾 🐾 🐾

![PAWSCRIBE](https://github.com/HucksApp/pawscribe/blob/pawscribe_client/src/images/back5.svg "Title is optional")

## Overview
The main branch serves as the core repository for the Pawscribe project.
Pawscribe is a Document management, Sofware Development and collaboration Tool
### [pawscribe -> backend](https://github.com/HucksApp/pawscribe/tree/pawscribe "backend") : Handles the server-side logic, API routes, socket routes, session management, database management, containers, data syncronizing.
### [pawscribe_client -> frontend](https://github.com/HucksApp/pawscribe/tree/pawscribe_client "frontend") : Manages the user interface, document presentation, software development, collaboration tools (IDE).

## Key Features
* File & Folder Management: Users can create folders, add files, scripts and manage their hierarchy.
* Real-time Synchronization: Files and text scripts sync changes in real-time across users, ensuring version control.
* Hash-based Content Validation: Every file and script content is hashed, and any content changes are identified by hash differences.
* Software Development Tool: Integrated Development enviroment with features like full user controlled code editor, Terminal ........
* Collaborative Coding and Editing: Multiple users can see and edit code in real Time. View project and all it's content files
* User Authentication: JWT-based authentication secures user access to different sections of the app.

## Reference
* [Youtube demo](https://www.youtube.com/watch?v=6JbJsOSW1fM "pawscribe")
* [other demo](https://www.flexclip.com/share/694478929b9c352b019f1d0c0ec1f27c7cdfab8.html "pawscribe")

## Installation
```

# Clone repository
$ git clone https://github.com/HucksApp/pawscribe.git
$ cd pawscribe
# Navigate to the backend or frontend for setup

```

## General Workflow
* **Authentication:** The user logs in to access their files and folders.
* **Folder & File Navigation:** The user can create folders, scripts and files, arrange them in a hierarchy, and navigate the structure.
* **File Upload/Creation:** Files and scripts can be uploaded or created within folders.
* **Content Sync:** Every file or script has an associated content hash. When the user makes changes, the system checks whether the hash has changed. If no other parent references the file, it updates the file; otherwise, it creates a new version and links it.
* **Save & Sync:** The app syncs changes to the back-end. If changes are detected, the back-end decides whether to update the existing file/script or to create a new one.
* **Hash Matching & Version Control:** The system checks hashes to ensure the content's integrity and manages changes for multiple references of the same content.
* **Collaborative Editing:** When multiple users are editing the same file/script, changes are merged and saved based on hash differences.

