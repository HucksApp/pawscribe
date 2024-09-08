import React, { useState } from 'react';
import axios from 'axios';
import {
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import Groups2Icon from '@mui/icons-material/Groups2';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { motion } from 'framer-motion';
import { Notify } from '../utils/Notification';
import ModalCore from './ModalCore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FeedIcon from '@mui/icons-material/Feed';
import ImageIcon from '@mui/icons-material/Image';
import codeIcon from '../utils/codeIcon';
import AlertDialog from './Alert';
import '../css/fileview.css';

const Text = ({ text, setStateChange }) => {
  console.log(text);
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const colorPallets = {
    php: '#87CEFA',
    pdf: '#A9A9A9',
    js: '#FFFF00',
    html: '#FF0000',
    sh: '#ff4500',
    css: '#0000FF',
    py: '#2b35af',
  };
  const colorPallet = colorPallets[text.file_type.replace('.', '')]
    ? colorPallets[text.file_type.replace('.', '')]
    : '#ffff';

  const icon = text => {
    const type = text.file_type.replace('.', '');
    switch (type) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'html':
      case 'py':
      case 'c':
      case 'cpp':
      case 'css':
      case 'java':
      case 'rb':
        return <img className="iconImage" src={codeIcon(type)} />;

      case 'doc':
      case 'txt':
        return (
          <FeedIcon
            sx={{
              fontSize: 40,
              color: '#000000',
              fontWeight: 1000,
            }}
          />
        );
      case 'pdf':
        return (
          <PictureAsPdfIcon
            sx={{
              fontSize: 40,
              color: '#FF0000',
              fontWeight: 1000,
            }}
          />
        );

      case 'svg':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return (
          <ImageIcon
            sx={{
              fontSize: 40,
              color: '#4285F4',
              fontWeight: 1000,
            }}
          />
        );
      default:
        return (
          <InsertDriveFileIcon
            sx={{
              fontSize: 40,
              color: '#616161',
              fontWeight: 1000,
            }}
          />
        );
    }
  };

  /*const handleClick = async () => {
        console.log("here")
        const response = await axios.get(`${base}/Api/v1/files/download/${file.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            responseType: 'blob'
        });
        console.log(response.data)
        const url = URL.createObjectURL(new Blob([response.data]));
        setIframeSrc(url);
    }*/

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(new Blob([text.content]));
    link.target = '_blank';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleMenuClose();
    Notify({ message: 'script Downloaded', type: 'success' });
  };

  const handlePrivacy = async () => {
    try {
      const response = await axios.get(
        `${base}/Api/v1/text/private/${text.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Notify({ message: response.data.message, type: 'success' });
      console.log(response.data);
    } catch (error) {
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
    setStateChange(true);
    handleMenuClose();
  };

  const handleSaveToFile = async () => {
    try {
      const response = await axios.post(
        `${base}/Api/v1/text/to_file/${text.id}`,
        { filename: name, extension: text.file_type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpen(false);
      Notify({ message: 'Script Saved To File', type: 'success' });
      console.log(response.data);
    } catch (error) {
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
    setStateChange(true);
    setOpen(false);
    handleMenuClose();
    setName('');
  };

  const handleCloseAll = () => {
    setOpen(false);
    handleMenuClose();
  };

  const handleDelete = () => {
    handleMenuClose();
    setDialogOpen(true);
  };

  const handleNo = () => {
    setDialogOpen(false);
  };

  const handleYes = async () => {
    try {
      const response = await axios.delete(`${base}/Api/v1/text/${text.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Notify({ message: response.data.message, type: 'success' });
    } catch (error) {
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
    setStateChange(true);
    setDialogOpen(false);
    handleMenuClose();
  };

  const handleEdit = () => {
    // Edit logic here
    handleMenuClose();
  };

  const handleShare = () => {
    // Share logic here
    handleMenuClose();
  };

  let PrivateViewIcon;
  if (text.private == true) {
    PrivateViewIcon = LockIcon;
  } else PrivateViewIcon = LockOpenIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.9 }}
    >
      <div className="card">
        <CardContent>
          <div className="filetype">{text.file_type}</div>
          <p
            className="file_type_pigment"
            style={{ backgroundColor: colorPallet }}
          ></p>
          <div onClick={() => console.log(text)}>{icon(text)}</div>
        </CardContent>
        <CardActions>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon color="primary" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>
              <EditIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Edit</div>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <DeleteIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Delete</div>
            </MenuItem>
            <MenuItem onClick={handleShare}>
              <Groups2Icon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Collaborate</div>
            </MenuItem>
            <MenuItem onClick={handleDownload}>
              <DownloadIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Download as File</div>
            </MenuItem>
            <MenuItem onClick={() => setOpen(true)}>
              <SaveIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Save To File</div>
            </MenuItem>
            <MenuItem onClick={handlePrivacy}>
              <PrivateViewIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              {text && text.private ? (
                <div className="menuitem">Private</div>
              ) : (
                <div className="menuitem">Public</div>
              )}
            </MenuItem>
          </Menu>
        </CardActions>
      </div>
      <ModalCore
        open={open}
        handleClose={handleCloseAll}
        view_type={'toFile'}
        value={name}
        setValue={setName}
        handleClick={handleSaveToFile}
      />
      <AlertDialog
        title={'Alert'}
        message={`Delete this ${text.file_type} script completely ?`}
        handleYes={handleYes}
        handleNo={handleNo}
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
      />
    </motion.div>
  );
};

Text.propTypes = {
  text: PropTypes.array.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default Text;
