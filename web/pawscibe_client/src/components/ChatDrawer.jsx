import React, { useState, useEffect } from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

const socket = io.connect('http://0.0.0.0:8000'); // Adjust the URL accordingly

const ChatDrawer = ({ open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('receive_message', message => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('send_message', newMessage);
      setNewMessage('');
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 300, padding: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3>Collaboration Chat</h3>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText primary={msg} />
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', marginTop: 'auto' }}>
          <TextField
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <IconButton onClick={sendMessage} color="primary">
            <Send />
          </IconButton>
        </div>
      </div>
    </Drawer>
  );
};

ChatDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ChatDrawer;
