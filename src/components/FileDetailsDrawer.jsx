import React from 'react';
import { Drawer, List, ListItem, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import '../css/drawer.css';

const FileDetailsDrawer = ({ file, onClose, open }) => {
  console.log(file, 'naaaaaaaa');

  // Return null if no file object is passed
  if (!file) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="iconDrawerClose">
        <CloseIcon sx={{ fontSize: 30, color: '#616161' }} onClick={onClose} />
      </div>
      <List style={{ width: 300, padding: 20 }}>
        <ListItem>
          <div className="listitem">
            <div className="itemtitle">Name</div>
            <div className="itemvalue">{file?.filename || 'Unknown'}</div>
          </div>
        </ListItem>
        <Divider />
        <ListItem>
          <div className="listitem">
            <div className="itemtitle">Created Date</div>
            <div className="itemvalue">
              {file?.created_at
                ? new Date(file.created_at).toLocaleString()
                : 'N/A'}
            </div>
          </div>
        </ListItem>
        <Divider />
        <ListItem>
          <div className="listitem">
            <div className="itemtitle">Shared With Key</div>
            <div className="itemvalue">
              {file?.shared_with_key ? file.shared_with_key : 'NULL'}
            </div>
          </div>
        </ListItem>
        <Divider />
        <ListItem>
          <div className="listitem">
            <div className="itemtitle">Private</div>
            <div className="itemvalue">
              {file?.private !== undefined ? file.private.toString() : 'N/A'}
            </div>
          </div>
        </ListItem>
        <Divider />
        <ListItem>
          <div className="listitem">
            <div className="itemtitle">Created Date</div>
            <div className="itemvalue">
              {file?.created_at
                ? new Date(file.created_at).toLocaleString()
                : 'N/A'}
            </div>
          </div>
        </ListItem>
        <Divider />
        <ListItem>
          <div className="listitem">
            <div className="itemtitle">Updated Date</div>
            <div className="itemvalue">
              {file?.updated_at
                ? new Date(file.updated_at).toLocaleString()
                : 'N/A'}
            </div>
          </div>
        </ListItem>
        <Divider />
      </List>
    </Drawer>
  );
};

FileDetailsDrawer.propTypes = {
  file: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default FileDetailsDrawer;
