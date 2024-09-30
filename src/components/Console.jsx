import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import socket from '../utils/transport';
//import { motion } from 'framer-motion';
import Prompt from './Prompt';
import History from './History'; // Import the new History component
import '../css/terminal.css'; // You can style this as needed

const Terminal = ({ open, themeType }) => {
  const fColor = theme => (theme === 'vs-dark' ? '#e5e5e5' : '#1E1E1E');
  const bgtheme = theme =>
    theme === 'vs-dark'
      ? { backgroundColor: '#1E1E1E', color: '#ffff' }
      : { backgroundColor: '#e5e5e5', color: '#616161' };

  const [history, setHistory] = useState([]);
  const [historyCm, setHistoryCm] = useState([]);
  const [input, setInput] = useState('');
  const [commandIndex, setCommandIndex] = useState(-1);
  const terminalRef = useRef(null);
  const prompt = 'User@pawscribe:$';

  // Socket listeners
  useEffect(() => {
    socket.on('code_result', data => {
      appendToHistoryCm('run:');
      appendToHistory(`${prompt}run: ${data.output}`);
    });

    socket.on('command_result', data => {
      appendToHistory(data.output);
    });

    return () => {
      socket.off('code_result');
      socket.off('command_result');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const appendToHistory = message => {
    setHistory(prev => [...prev, message]);
  };

  const appendToHistoryCm = message => {
    setHistoryCm(prev => [...prev, message]);
  };

  const handleInputChange = e => {
    setInput(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
      setCommandIndex(-1);
    } else if (e.key === 'ArrowUp') {
      if (commandIndex < historyCm.length - 1) {
        setCommandIndex(prevIndex => prevIndex + 1);
        setInput(historyCm[historyCm.length - 1 - commandIndex - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      if (commandIndex > 0) {
        setCommandIndex(prevIndex => prevIndex - 1);
        setInput(historyCm[historyCm.length - 1 - commandIndex + 1]);
      } else if (commandIndex === 0) {
        setCommandIndex(-1);
        setInput('');
      }
    }
  };

  const handleCommand = command => {
    if (command === 'clear') {
      setHistory([]);
      setHistoryCm([]);
    } else {
      socket.emit('send_command', { command });
      appendToHistoryCm(command);
      appendToHistory(`${prompt} ${command}`);
    }
  };

  const handleCopy = content => {
    navigator.clipboard.writeText(content);
  };

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  return (
    <div
      style={bgtheme(themeType)}
      className={`terminal ${open ? 'open' : 'closed'}`}
      ref={terminalRef}
    >
      {/* Render the History component */}
      <History
        history={history}
        historyCm={historyCm}
        handleCopy={handleCopy}
      />
      <div className="terminal-input">
        <span>
          <Prompt user={'User'} root={'~'} />
        </span>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Type your command..."
          style={{ color: fColor(themeType) }}
        />
      </div>
    </div>
  );
};

Terminal.propTypes = {
  open: PropTypes.bool.isRequired,
  themeType: PropTypes.string.isRequired,
};

export default Terminal;
