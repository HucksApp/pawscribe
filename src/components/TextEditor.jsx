import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Notify } from '../utils/Notification';
import TextEditorToolBar from './TextEditorToolBar';
import ChatDrawer from './ChatDrawer';
import { Box } from '@mui/material';
import axios from 'axios';
import ConsoleDrawer from './ConsoleDrawer';
import PropTypes from 'prop-types';
import { useNavigate /*, useLocation*/ } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setProject, selectProject } from '../store/projectSlice';
// import { addFile } from '../store/fileSlice';
import { useSearchParams } from 'react-router-dom';
import ProjectDrawer from './ProjectDrawer';
import '../css/editor.css';
import hashSHA256 from '../utils/hash';
import DataQueueCache from '../store/queue';
import socket from '../utils/transport';
import getFileContent from '../utils/projectBlob';
// import { addFileBlob } from '../store/fileBlobSlice';

const TextEditor = ({ setStateChange }) => {
  const [running, setRunning] = useState(false);
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
  //const [consoleOutput, setConsoleOutput] = useState('');
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
  const filesblobIn = useSelector(state => state.fileBlobs);
  const textsIn = useSelector(state => state.texts);
  console.log('file id =====>', fileId);
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

  const fetchScript = async () => {
    try {
      const response = await axios.get(`${base}/Api/v1/text/${textId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleSetEditorContent(response.data.content);
    } catch (error) {
      console.log('Failed to fetch folder contents:', error);
    }
  };

  const fetchFile = async () => {
    console.log('hereeee------>');
    try {
      const { fetchBlobContent, loading } = getFileContent(fileId);
      if (!loading) {
        const content = fetchBlobContent();
        console.log('hereeee------>', content);
        handleSetEditorContent(content);
      }
    } catch (error) {
      console.log('Failed to fetch folder contents:', error);
    }
  };

  useEffect(() => {
    // Define the function to add file to queue
    const addFileQueue = () => {
      if (fileId && editorContent) {
        DataQueueCache.setDataQueue(
          `file_${fileId}`,
          { id: fileId, content: editorContent },
          24 * 60 * 60 * 1000 // 24 hours TTL
        );
      }
    };
    // When component is unmounted, add the file to the queue
    return () => {
      addFileQueue();
    };
  }, [fileId, editorContent]);

  useEffect(() => {
    // Define the function to add script(text) to queue
    const addScriptQueue = () => {
      if (textId && editorContent) {
        DataQueueCache.setDataQueue(
          `text_${textId}`,
          { id: textId, content: editorContent },
          24 * 60 * 60 * 1000 // 24 hours TTL
        );
      }
    };
    // When component is unmounted, add the script to the queue
    return () => {
      addScriptQueue();
    };
  }, [textId, editorContent]);

  useEffect(() => {
    socket.on('code_result', () => {
      setRunning(false);
    });
  }, [running]);

  useEffect(() => {
    const handleInfoExe = data => {
      Notify({
        message: data.message,
        type: 'info',
      });
    };
    const handleErrorExe = data => {
      Notify({
        message: data.message,
        type: 'error',
      });
    };
    socket.on('error_result', handleErrorExe);
    socket.on('info_result', handleInfoExe);
    return () => {
      socket.off('error_result', handleErrorExe);
      socket.off('info_result', handleInfoExe);
    };
  }, [socket]);

  useEffect(() => {
    if (folderId !== '' && folderId !== null) {
      fetchFolderTree();
    }
  }, [folderId]);

  useEffect(() => {
    const handleDbChanged = () => {
      if (folderId != '' && folderId != null) fetchFolderTree();
    };

    socket.on('db_changed', handleDbChanged);

    return () => {
      socket.off('db_changed', handleDbChanged);
    };
  }, [socket]);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const toggleDrawer = () => {
    console.log(open);
    if (open === false) {
      socket.emit('start_terminal', {});
    }
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
    if (fileId && editor) {
      const cachedDataQueue = DataQueueCache.getDataQueue(`file_${fileId}`);
      console.log('Cached content for fileId:', cachedDataQueue); // Log cached content
      if (cachedDataQueue) {
        console.log('Setting cached content to editor.'); // Log setting of cached content
        console.log('Cached content for fileId 2:', cachedDataQueue);
        handleSetEditorContent(cachedDataQueue.content);
      } else {
        const inMemo = filesblobIn.find(blob => blob.id === fileId.toString());
        if (inMemo) {
          inMemo.blob
            .text()
            .then(content => {
              console.log('Setting blob content to editor.'); // Log setting of blob content
              handleSetEditorContent(content);
            })
            .catch(err => {
              console.error('Error reading blob content:', err);
            });
        } else {
          fetchFile(); // fetch from API if not found in memory
        }
      }
    } else if (textId && editor) {
      const cachedDataQueue = DataQueueCache.getDataQueue(`text_${textId}`);
      if (cachedDataQueue) {
        console.log('Cached content for textId:', cachedDataQueue.content); // Log cached content
        handleSetEditorContent(cachedDataQueue.content);
      } else {
        const inMemo = textsIn.find(text => text.id === textId);
        if (inMemo) {
          console.log('Memoized content found:', inMemo.content); // Log memoized content
          handleSetEditorContent(inMemo.content);
        } else {
          fetchScript(); // fetch from API if not found in memory
        }
      }
    }
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
    if (folderId) await handleProjectSync();
    else if (fileId) await handleFileSync();
    else if (textId) await handleScriptSync();
  };

  const handleFileSync = async () => {
    const payload = {
      content: editorContent,
      file_id: fileId,
    };
    try {
      const response = await axios.post(`${base}/Api/v1/files/save`, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Assuming `token` is available in your component
        },
      });
      console.log(response);
      Notify({ message: response.data.message, type: 'success' });
    } catch (error) {
      console.log(error);

      // Check if error.response exists before accessing error.response.data
      if (error.response) {
        if (
          error.response.data.message &&
          error.response.data.message === 'Token has expired'
        ) {
          navigate('/');
        } else {
          Notify({
            message: `${error.message}. ${error.response.data.message}`,
            type: 'error',
          });
        }
      } else {
        // Handle other errors (e.g., network errors, no response from server)
        Notify({
          message: `Error: ${error.message}. Something went wrong.`,
          type: 'error',
        });
      }
    }
  };

  const handleScriptSync = async () => {
    const payload = {
      content: editorContent,
      text_id: textId,
    };
    try {
      const response = axios.post(`${base}/Api/v1/text/save`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Notify({ message: response.data.message, type: 'success' });
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (
          error.response.data.message &&
          error.response.data.message === 'Token has expired'
        ) {
          navigate('/');
        } else {
          Notify({
            message: `${error.message}. ${error.response.data.message}`,
            type: 'error',
          });
        }
      } else {
        // Handle other errors (e.g., network errors, no response from server)
        Notify({
          message: `Error: ${error.message}. Something went wrong.`,
          type: 'error',
        });
      }
    }
  };

  const handleProjectSync = async () => {
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
            : [...queue];

        resolve(newQueue);
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

  const runProjectSrc = () => {
    socket.emit('run_code', {
      parent_folder_id: folderId || null,
      type:
        currentItem.item && currentItem.item.fx
          ? currentItem.item.fx.type
          : null,
      entry_point_id:
        currentItem.item && currentItem.item.fx && currentItem.item.fx.file_id
          ? currentItem.item.fx.file_id
          : currentItem.item &&
              currentItem.item.fx &&
              currentItem.item.fx.text_id
            ? currentItem.item.fx.text_id
            : null,
      language: options.language,
    });
  };

  const runFileSrc = () => {
    socket.emit('run_code', {
      type: 'File',
      entry_point_id: fileId,
      language: options.language,
      code: editorContent,
    });
  };

  const runScriptSrc = () => {
    socket.emit('run_code', {
      type: 'Text',
      entry_point_id: textId,
      language: options.language,
      code: editorContent,
    });
  };

  const runCode = async () => {
    setRunning(true);
    if (folderId) runProjectSrc();
    if (fileId) runFileSrc();
    if (textId) runScriptSrc();
    setIsConsoleOpen(true);
  };
  const handleSetEditorContent = content => {
    setEditorContent(content);

    if (editorRef.current) {
      const model = editorRef.current.getModel();

      if (model) {
        model.setValue(content); // Set the content safely
        console.log('Editor content set to:', content);
      } else {
        console.error('Model not found for the editor.');
      }
    } else {
      console.error('EditorRef is not initialized.');
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
        running={running}
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
        themeType={options.theme}
      />
    </Box>
  );
};

TextEditor.propTypes = {
  setStateChange: PropTypes.func.isRequired,
};
export default TextEditor;
