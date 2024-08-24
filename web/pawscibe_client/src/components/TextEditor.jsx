import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Notify } from '../utils/Notification';
import TextEditorToolBar from './TextEditorToolBar';
import ChatDrawer from './ChatDrawer';
import { Box } from '@mui/material';
import axios from 'axios';
import ConsoleDrawer from './ConsoleDrawer';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { /*useSelector,*/ useDispatch } from 'react-redux';
import { setProject } from '../store/projectSlice';
import { useSearchParams } from 'react-router-dom';
import ProjectDrawer from './ProjectDrawer';
import '../css/editor.css';
const TextEditor = ({ setStateChange }) => {
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const [options, setOptions] = useState({
    theme: 'vs-dark',
    language: 'plaintext',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Raleway',
  });
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const [searchParams] = useSearchParams();
  const [consoleOutput, setConsoleOutput] = useState('');
  //const [stateChanged, setStateChanged] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const username = 'User'; // Change this to dynamically get the username
  const room = 'editorRoom'; // Change this to dynamically get the room
  const folderId = searchParams.get('folderId');

  useEffect(() => {
    const fetchFolderTree = async () => {
      try {
        const response = await axios.get(
          `${base}/Api/v1/folders/${folderId}/tree`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.data.folder.fx) response.data.folder.fx = {};
        console.log(response.data.folder);
        dispatch(setProject(response.data.folder));
      } catch (error) {
        console.error('Failed to fetch folder contents:', error);
      }
    };
    console.log(folderId);
    if (folderId != '' && folderId != null) fetchFolderTree();
  }, [folderId]);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const toggleDrawer = () => {
    console.log(open);
    setOpen(!open);
  };

  const addFile = () => {
    // Implement file addition logic here
  };

  const deleteFile = () => {
    // Implement file deletion logic here
  };

  const handleEditorDidMount = editor => {
    editorRef.current = editor;
  };

  const handleChangeOptions = newOptions => {
    setOptions(prevOptions => ({
      ...prevOptions,
      ...newOptions,
    }));
  };

  const handleSaveToBackend = async () => {
    // Implement the save to backend logic

    const addText = async () => {
      const extension = {
        python: '.py',
        bash: '.sh',
        javascript: '.js',
        plaintext: '.txt',
        java: '.java',
        html: '.html',
        typescript: '.ts',
        css: '.css',
        ruby: '.rb',
        php: '.php',
        c: '.c',
        cpp: '.cpp',
      };
      console.log(options.language);
      try {
        const response = await axios.post(
          base + '/Api/v1/text/share',
          {
            text_content: editorContent,
            file_type: extension[options.language],
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStateChange(false);
        Notify({ message: response.data.message, type: 'success' });
      } catch (error) {
        console.log(error);
        if (
          error.response.data.msg &&
          error.response.data.msg == 'Token has expired'
        )
          navigate('/');
        else
          Notify({
            message: `${error.message}. ${error.response.data.message}`,
            type: 'error',
          });
      }
    };
    addText();
  };

  const handleEditorChange = value => {
    setEditorContent(value);
    console.log(editorContent);
  };

  const handleSaveToFile = async () => {
    // Implement the save to file logic
  };

  const handleCollaborate = () => {
    // Implement the collaborate logic
  };

  const handleTogglePublic = isPublic => {
    // Implement the toggle public/private logic
    console.log(isPublic);
  };

  const runCode = async () => {
    setIsConsoleOpen(true);
    try {
      const response = await axios.post('/api/execute', {
        code: editorContent,
        language: options.language,
      });
      setConsoleOutput(response.data.output);
      console.log(consoleOutput);
    } catch (error) {
      console.error('Error executing code:', error);
      setConsoleOutput('Error executing code');
    }
  };

  const handleSetEditorContent = content => {
    setEditorContent(content);
    if (editorRef.current) {
      editorRef.current.setValue(content); // Directly update the editor content
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextEditorToolBar
        onThemeChange={theme => handleChangeOptions({ theme })}
        onLanguageChange={language => handleChangeOptions({ language })}
        onFontWeightChange={fontWeight => handleChangeOptions({ fontWeight })}
        onFontSizeChange={fontSize => handleChangeOptions({ fontSize })}
        onFontFamilyChange={fontFamily => handleChangeOptions({ fontFamily })}
        onSaveToBackend={handleSaveToBackend}
        onSaveToFile={handleSaveToFile}
        onCollaborate={handleCollaborate}
        onTogglePublic={handleTogglePublic}
        runCode={runCode}
        toggleChat={toggleChat}
        toggleDrawer={toggleDrawer}
      />
      <Box className="editorcase" sx={{ height: '80vh', width: '100%' }}>
        <div className="editorcase">
          <ProjectDrawer
            open={open}
            className={'projectdrawer'}
            themeType={options.theme}
            toggleDrawer={toggleDrawer}
            addFile={addFile}
            deleteFile={deleteFile}
            setEditorContent={handleSetEditorContent}
          />
          <Editor
            height="100%"
            language={options.language}
            theme={options.theme}
            options={{
              fontSize: options.fontSize,
              fontWeight: options.fontWeight,
              fontFamily: options.fontFamily,
            }}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
          />
        </div>
      </Box>
      <ChatDrawer
        open={chatOpen}
        onClose={toggleChat}
        room={room}
        username={username}
      />
      <ConsoleDrawer
        open={isConsoleOpen}
        onClose={() => setIsConsoleOpen(!isConsoleOpen)}
        code={editorContent}
        language={options.language}
      />
    </Box>
  );
};

TextEditor.propTypes = {
  setStateChange: PropTypes.func.isRequired,
};
export default TextEditor;
