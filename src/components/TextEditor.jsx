import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Notify } from '../utils/Notification';
import TextEditorToolBar from './TextEditorToolBar';
import ChatDrawer from './ChatDrawer';
import { Box } from '@mui/material';
import axios from 'axios';
import ConsoleDrawer from './ConsoleDrawer';
import PropTypes from 'prop-types';
import { useNavigate /*useLocation*/ } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setProject, selectProject } from '../store/projectSlice';
import { useSearchParams } from 'react-router-dom';
import ProjectDrawer from './ProjectDrawer';
import '../css/editor.css';
import hashSHA256 from '../utils/hash';
import DataQueueCache from '../store/queue';
import socket from '../utils/transport';

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
  const [currentItem, setCurrentItem] = useState({}); // current Data
  const [dataQueue, setDataQueue] = useState([]); // Data queue
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isEmptyQueue, setIsEmptyQueue] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const username = 'User'; // Change this to dynamically get the username
  const room = 'editorRoom'; // Change this to dynamically get the room
  const folderId = searchParams.get('folderId'); // project ID
  const fileId = searchParams.get('fileId'); // project ID
  const textId = searchParams.get('textId'); // project ID
  //const location = useLocation();
  const project = useSelector(selectProject);

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

  // useEffect(() => {
  //   const fetchFileEdit = async () => {
  //     try {
  //       const response = await axios.get(`${base}/Api/v1/files/${fileId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       return response.data.text();
  //     } catch (error) {
  //       console.log(error); // handle with notify
  //     }
  //   };
  //   if (fileId) {
  //     const fileContent = fetchFileEdit();
  //     setEditorContent(fileContent);
  //   }
  // }, [fileId]);

  // useEffect(() => {
  //   const fetchTextEdit = async () => {
  //     try {
  //       const response = await axios.get(`${base}/Api/v1/texts/${textId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       return response.data.content;
  //     } catch (error) {
  //       console.log(error); // handle with notify
  //     }
  //   };
  //   if (textId) {
  //     const textContent = fetchTextEdit();
  //     setEditorContent(fileContent);
  //   }
  // }, [textId]);

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

  useEffect(() => {
    if (isEmptyQueue) {
      Notify({
        message: 'No changes to save',
        type: 'info',
      });
      setIsEmptyQueue(false);
    }
  }, [isEmptyQueue]);

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
    setCurrentItem({ ...currentItem, content: value });
    console.log(editorContent);
  };

  const handleSaveSync = async () => {
    console.log(dataQueue);

    const updatedQueue = await new Promise(resolve => {
      setDataQueue(prev => {
        const queue = prev ? prev.filter(obj => obj.id !== currentItem.id) : [];
        const newQueue =
          Object.keys(currentItem).length > 0
            ? [
                ...queue,
                { ...currentItem, currentHash: hashSHA256(editorContent) },
              ]
            : [...queue]; // Make sure to use `queue` instead of `prev`

        resolve(newQueue); // Resolve the promise with the updated queue
        return newQueue;
      });
    });

    // Once you have the updatedQueue, continue processing
    const filteredQueue = (updatedQueue || []).filter(item => {
      console.log(item.initialHash, item.currentHash, '------ mrrrrrrrrrrrrrr');
      return item.initialHash !== item.currentHash; // Return true if content has changed
    });

    console.log(filteredQueue, '======>');

    const payload = filteredQueue.map(item => {
      const { content, item: innerItem } = item; // Renaming to innerItem for clarity

      // Ensure both innerItem and its fx property exist
      const fx = innerItem?.fx;

      if (!fx) {
        console.error('fx property is missing in some items', item);
        return null;
      }

      return {
        fx,
        hash: hashSHA256(content), // Updated hash
        content, // Updated content
      };
    });

    if (payload.length === 0) {
      setIsEmptyQueue(true);
      return;
    }

    console.log(payload, '=======payload');

    // Now we handle the actual saving operation
    axios
      .post(`${base}/Api/v1/folders/save/sync`, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Assuming `token` is available in your component
        },
      })
      .then(response => {
        console.log(response.data);

        for (let obj of response.data) {
          if (obj.valid) {
            Notify({
              message: `${obj.message}`,
              type: 'success',
            });
          }
        }
        setDataQueue([]);
        DataQueueCache.clearDataQueue(`project_${project.id}`);
      })
      .catch(error => {
        console.error('Error saving changes:', error);
      });
  };

  const handleCollaborate = () => {
    // Implement the collaborate logic
  };

  const handleTogglePublic = isPublic => {
    // Implement the toggle public/private logic
    console.log(isPublic);
  };

  const runCode = async () => {
    socket.emit('run_code', {
      parent_folder_id: folderId || null,
      type:
        currentItem.item && currentItem.item.fx
          ? currentItem.item.fx.type
          : null,
      entry_point_id:
        currentItem.item && currentItem.item.fx
          ? currentItem.item.fx.file_id
          : null,
      language: options.language,
      code: fileId || textId ? editorContent : null,
    });
    setIsConsoleOpen(true);

    socket.on('code_result', data => {
      if (data.valid) {
        console.log(data.output);
        setConsoleOutput(data.output);
      } else {
        Notify({
          message: `${data.message}`,
          type: 'error',
        });
      }
    });
    console.log('here');
    console.log(consoleOutput);

    // setIsConsoleOpen(true);
    // try {
    //   const response = await axios.post('/api/execute', {
    //     code: editorContent,
    //     language: options.language,
    //   });
    //   setConsoleOutput(response.data.output);
    //   console.log(consoleOutput);
    // } catch (error) {
    //   console.error('Error executing code:', error);
    //   setConsoleOutput('Error executing code');
    // }
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
        onSaveToFile={handleSaveSync}
        onCollaborate={handleCollaborate}
        onTogglePublic={handleTogglePublic}
        runCode={runCode}
        toggleChat={toggleChat}
        toggleDrawer={toggleDrawer}
        folderId={folderId}
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
            editorContent={editorContent}
            setCurrentItem={setCurrentItem}
            currentItem={currentItem}
            dataQueue={dataQueue}
            setDataQueue={setDataQueue}
            onLanguageChange={language => handleChangeOptions({ language })}
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
        consoleOutput={consoleOutput}
        themeType={options.theme}
      />
    </Box>
  );
};

TextEditor.propTypes = {
  setStateChange: PropTypes.func.isRequired,
};
export default TextEditor;
