import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Tooltip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code'; // Example of an icon for commands
import TerminalIcon from '@mui/icons-material/Terminal'; // Another icon for terminal output
import '../css/history.css'; // Add specific styling for the history component

const History = ({ history, historyCm, handleCopy }) => {
  return (
    <div className="history-container">
      {history.map((line, index) => (
        <div key={index} className="history-item">
          <AnimatePresence>
            <motion.div
              key={`slideDiv-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="history-content"
            >
              <Tooltip title="Copy Command" arrow>
                <Avatar
                  className="history-icon"
                  onClick={() => handleCopy(historyCm[index])}
                >
                  {index % 2 === 0 ? <CodeIcon /> : <TerminalIcon />}
                </Avatar>
              </Tooltip>
              <p>{line}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

History.propTypes = {
  history: PropTypes.array.isRequired,
  historyCm: PropTypes.array.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

export default History;
