import './css/App.css';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import { Provider } from 'react-redux';
//import { CssBaseline } from '@mui/material';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import FilesDashboard from './components/FilesDashboard';
import TextDashboard from './components/TextDashboard';
import TextEditor from './components/TextEditor';
import { ToastContainer } from 'react-toastify';
import OpenViewFile from './components/OpenViewFile';
import FolderDashboard from './components/FolderDashboard';
import Profile from './components/Profile';
//import Folder from './components/Folder';
import OpenFolderView from './components/OpenFolderView';
import store from './store/store';
// process.env.REACT_APP_BASE_API_URL

const App = () => {
  const [stateChanged, setStateChange] = useState(false); // manually triger state change
  const [editorContent, setEditorContent] = useState('');

  return (
    <Provider store={store}>
      <div className="App">
        <ToastContainer autoClose={5000} hideProgressBar={true} />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  stateChanged={stateChanged}
                  setStateChange={setStateChange}
                />
              }
            />
            <Route
              path="/editor"
              element={
                <TextEditor
                  editorContent={editorContent}
                  setEditorContent={setEditorContent}
                  setStateChange={setStateChange}
                />
              }
            />
            <Route
              path="/files"
              element={
                <FilesDashboard
                  setStateChange={setStateChange}
                  stateChanged={stateChanged}
                />
              }
            />
            <Route
              path="/texts"
              element={
                <TextDashboard
                  setStateChange={setStateChange}
                  stateChanged={stateChanged}
                />
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/viewfile" element={<OpenViewFile />} />
            <Route
              path="/folders"
              element={
                <FolderDashboard
                  setStateChange={setStateChange}
                  stateChanged={stateChanged}
                />
              }
            />
            <Route path="/openfolder" element={<OpenFolderView />} />

            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
