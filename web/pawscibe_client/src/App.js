import './css/App.css';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
//import { CssBaseline } from '@mui/material';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import FilesDashboard from './components/FilesDashboard';
import TextDashboard from './components/TextDashboard';
import TextEditor from './components/TextEditor';
import { ToastContainer } from 'react-toastify';
import OpenViewFile from './components/OpenViewFile';
import Profile from './components/Profile';

// process.env.REACT_APP_BASE_API_URL

const App = () => {
  const [stateChanged, setStateChange] = useState(false); // manually triger state change
  const [files, setFiles] = useState([]);
  const [texts, setTexts] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  return (
    <div className="App">
      <ToastContainer autoClose={5000} hideProgressBar={true} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                texts={texts}
                setTexts={setTexts}
                files={files}
                setFiles={setFiles}
                stateChanged={stateChanged}
                setStateChange={setStateChange}
              />
            }
          />
          <Route
            path="/editor"
            element={
              <TextEditor
                texts={texts}
                setTexts={setTexts}
                files={files}
                setFiles={setFiles}
                editorContent={editorContent}
                setEditorContent={setEditorContent}
              />
            }
          />
          <Route
            path="/files"
            element={
              <FilesDashboard
                files={files}
                setFiles={setFiles}
                setStateChange={setStateChange}
                stateChanged={stateChanged}
              />
            }
          />
          <Route
            path="/texts"
            element={
              <TextDashboard
                texts={texts}
                setTexts={setTexts}
                setStateChange={setStateChange}
                stateChanged={stateChanged}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                texts={texts}
                setTexts={setTexts}
                files={files}
                setFiles={setFiles}
              />
            }
          />
          <Route
            path="/viewfile"
            element={
              <OpenViewFile
                texts={texts}
                setTexts={setTexts}
                files={files}
                setFiles={setFiles}
              />
            }
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
