import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import socket from '../utils/transport';
import { motion, AnimatePresence } from 'framer-motion';
import Prompt from './Prompt';
import '../css/terminal.css'; // You can style this as needed

const Terminal = ({ open, themeType /*, currentItem*/ }) => {
  const fColor = theme => (theme == 'vs-dark' ? '#e5e5e5' : '#1E1E1E');
  const bgtheme = theme =>
    theme == 'vs-dark'
      ? { backgroundColor: '#1E1E1E', color: '#ffff' }
      : { backgroundColor: '#e5e5e5', color: '#616161' };
  const [history, setHistory] = useState([]);
  const [historyCm, setHistoryCm] = useState([]);
  const [input, setInput] = useState('');
  const terminalRef = useRef(null);
  const prompt = 'User@pawscribe:$';
  useEffect(() => {
    socket.on('code_result', data => {
      //{command: $`run ${currentItem.fx.name}`, data}
      appendToHistoryCm('run:');
      appendToHistory(`${prompt}run: ${data.output}`);
    });

    socket.on('command_result', data => {
      console.log(data, '........');

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
    //scrollToBottom();
  };

  const appendToHistoryCm = message => {
    setHistoryCm(prev => [...prev, message]);
    //scrollToBottom();
  };

  const handleInputChange = e => {
    setInput(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  const handleCopy = content => {
    navigator.clipboard.writeText(content);
  };

  const handleCommand = command => {
    socket.emit('send_command', { command });
    //{command}
    appendToHistoryCm(command);
    appendToHistory(`${prompt} ${command}`); // Show command in history
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
      <div className="terminal-output">
        {history.map((line, index) => (
          <p
            className="terminal-history"
            onClick={() => handleCopy(historyCm[index])}
            key={index}
          >
            <AnimatePresence>
              <motion.div
                key={`slideDiv-${index}`}
                initial={{ x: '-10vw', opacity: 0 }} // Starts off-screen
                animate={{ x: 0, opacity: 1 }} // Translates in
                exit={{ x: '10vw', opacity: 0 }} // Translates out
                transition={{ duration: 0.5 }} // Optional transition duration
              >
                {line}
              </motion.div>
            </AnimatePresence>
          </p>
        ))}
      </div>
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
