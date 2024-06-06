import './css/App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import FilesDashboard from './components/FilesDashboard'
import TextDashboard from './components/TextDashboard'
import TextEditorContainer from './components/TextEditorContainer';
import {ToastContainer } from 'react-toastify';
// process.env.REACT_APP_BASE_API_URL

function App() {
  return (
    <div className="App">
      <ToastContainer
    autoClose={5000}
    hideProgressBar={true}
    />
      <Router>
      <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/editor' element={<TextEditorContainer/>}/>
      <Route path='/files' element={<FilesDashboard/>}/>
      <Route path='/texts' element={<TextDashboard/>}/>
      </Routes>
      </Router>
    </div>
  );
}

export default App;
