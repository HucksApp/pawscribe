import React from 'react';
import { Drawer, List, ListItem, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import '../css/drawer.css';

const FileDetailsDrawer = ({ file, onClose, open }) => {
  console.log(file, 'naaaaaaaa');
  if (!file) return null;
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <motion.div
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="iconDrawerClose">
          <CloseIcon
            sx={{ fontSize: 30, color: '#616161' }}
            onClick={onClose}
          />
        </div>
        <List style={{ width: 300, padding: 20 }}>
          <ListItem>
            <div className="listitem">
              <div className="itemtitle">Name</div>
              <div className="itemvalue">{file && file.filename}</div>
            </div>
          </ListItem>
          <Divider />
          <ListItem>
            <div className="listitem">
              <div className="itemtitle">Created Date</div>
              <div className="itemvalue">
                {file && new Date(file.created_at).toLocaleString()}
              </div>
            </div>
          </ListItem>
          <Divider />
          <ListItem>
            <div className="listitem">
              <div className="itemtitle">Shared With Key</div>
              <div className="itemvalue">
                {file.shared_with_key ? file.shared_with_key : 'NULL'}
              </div>
            </div>
          </ListItem>
          <Divider />
          <ListItem>
            <div className="listitem">
              <div className="itemtitle">Private</div>
              <div className="itemvalue">{file && file.private.toString()}</div>
            </div>
          </ListItem>
          <Divider />
          <ListItem>
            <div className="listitem">
              <div className="itemtitle">Created Date</div>
              <div className="itemvalue">
                {file && new Date(file.created_at).toLocaleString()}
              </div>
            </div>
          </ListItem>
          <Divider />
          <ListItem>
            <div className="listitem">
              <div className="itemtitle">Updated Date</div>
              <div className="itemvalue">
                {file && new Date(file.updated_at).toLocaleString()}
              </div>
            </div>
          </ListItem>
          <Divider />
        </List>
      </motion.div>
    </Drawer>
  );
};

export default FileDetailsDrawer;
