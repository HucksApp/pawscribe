import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PropTypes from 'prop-types';
import { Notify } from '../utils/Notification';
import { useNavigate } from 'react-router-dom';

const AddFolder = ({ setStateChange }) => {
  const [open, setOpen] = useState(false);
  const [foldername, setFoldername] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');

  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFoldername('');
  };

  const handleAddFolder = async () => {
    try {
      const response = await axios.post(
        `${base}/Api/v1/folders/add`,
        { foldername, description, language },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Notify({ message: response.data.message, type: 'success' });
      setFoldername('');
      setStateChange(true);
      handleClose();
    } catch (error) {
      if (error.response)
        if (
          error.response.data.msg &&
          error.response.data.msg === 'Token has expired'
        )
          navigate('/');
        else
          Notify({
            message: `${error.message}. ${error.response.data.message} `,
            type: 'error',
          });
      else
        Notify({
          message: `${error.message}`,
          type: 'error',
        });
    }
  };

  return (
    <div className="add">
      <IconButton onClick={handleClickOpen}>
        <CreateNewFolderIcon color="secondary" fontSize="large" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            value={foldername}
            onChange={e => setFoldername(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Language"
            type="text"
            fullWidth
            value={language}
            onChange={e => setLanguage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            sx={{ fontFamily: 'Raleway', fontWeight: 1000 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddFolder}
            color="primary"
            sx={{ fontFamily: 'Raleway', fontWeight: 1000 }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AddFolder.propTypes = {
  setStateChange: PropTypes.func.isRequired,
};

export default AddFolder;
