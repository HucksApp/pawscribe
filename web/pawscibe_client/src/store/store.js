// store.js
import { configureStore } from '@reduxjs/toolkit';
import fileReducer, { loadFilesFromCache } from './fileSlice';
import textReducer, { loadTextsFromCache } from './textSlice';
import userReducer, { loadUserFromCache } from './userSlice';
import folderReducer, { loadFoldersFromCache } from './folderSlice';
import projectReducer, { loadProjectFromCache } from './projectSlice';
import fileBlobReducer, { loadFileBlobsFromCache } from './fileBlobSlice';

const store = configureStore({
  reducer: {
    files: fileReducer,
    fileBlobs: fileBlobReducer,
    texts: textReducer,
    folders: folderReducer,
    project: projectReducer,
    user: userReducer,
  },
});

store.dispatch(loadFilesFromCache());
store.dispatch(loadFileBlobsFromCache());
store.dispatch(loadTextsFromCache());
store.dispatch(loadFoldersFromCache());
store.dispatch(loadProjectFromCache());
store.dispatch(loadUserFromCache());

export default store;
