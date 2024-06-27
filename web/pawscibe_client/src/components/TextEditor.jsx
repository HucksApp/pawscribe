import React, { useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import TextEditorToolBar from './TextEditorToolBar';
import ChatDrawer from './ChatDrawer';
import { Box } from '@mui/material';
import axios from 'axios';
import ConsoleDrawer from './ConsoleDrawer';

const TextEditor = () => {
  const editorRef = useRef(null);
  const [options, setOptions] = useState({
    theme: 'vs-dark',
    language: 'plaintext',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Raleway',
  });
  const [consoleOutput, setConsoleOutput] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const username = 'User'; // Change this to dynamically get the username
  const room = 'editorRoom'; // Change this to dynamically get the room

  const toggleChat = () => {
    setChatOpen(!chatOpen);
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

  const handleSaveToBackend = () => {
    // Implement the save to backend logic
  };

  const handleEditorChange = value => {
    setEditorContent(value);
    console.log(editorContent);
  };

  const handleSaveToFile = () => {
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

  return (
    <Box>
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
      />
      <Box sx={{ height: '80vh' }}>
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

export default TextEditor;
