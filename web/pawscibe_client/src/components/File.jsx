import React, { useState /*useEffect*/ } from 'react';
import { useNavigate /*createSearchParams*/ } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import ShareIcon from '@mui/icons-material/Share';
import Groups2Icon from '@mui/icons-material/Groups2';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';
import { Notify } from '../utils/Notification';
import { /*useDispatch*/ useSelector } from 'react-redux';
//import { addFileBlob } from '../store/fileBlobSlice';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FeedIcon from '@mui/icons-material/Feed';
import ImageIcon from '@mui/icons-material/Image';
import codeIcon from '../utils/codeIcon';
import ModalCore from './ModalCore';
import AlertDialog from './Alert';
import '../css/fileview.css';

const File = ({ file, setStateChange, handleOpenFile }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const blob = useSelector(state =>
    state.fileBlobs.find(blob => blob.id === file.id.toString())
  );
  //const iframeSrc = URL.createObjectURL(blob);
  const iframeSrc = blob;
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const navigate = useNavigate();
  //const dispatch = useDispatch();

  const icon = file => {
    const type = file.filename.split('.').pop();
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
        return <img className="iconImageB" src={codeIcon(type)} />;

      case 'doc':
      case 'txt':
        return (
          <FeedIcon
            sx={{
              fontSize: 100,
              color: '#616161',
              fontWeight: 1000,
              alignSelf: 'center',
              ':hover': { color: '#878787' },
            }}
          />
        );
      case 'pdf':
        return (
          <PictureAsPdfIcon
            sx={{
              fontSize: 100,
              color: '#616161',
              fontWeight: 1000,
              alignSelf: 'center',
              ':hover': { color: '#878787' },
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
              fontSize: 100,
              color: '#616161',
              fontWeight: 1000,
              alignSelf: 'center',
              ':hover': { color: '#878787' },
            }}
          />
        );
      default:
        return (
          <InsertDriveFileIcon
            sx={{
              fontSize: 100,
              color: '#616161',
              fontWeight: 1000,
              alignSelf: 'center',
              ':hover': { color: '#878787' },
            }}
          />
        );
    }
  };

  const handleCloseAll = () => {
    setOpen(false);
    handleMenuClose();
  };

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      const response = await axios.delete(`${base}/Api/v1/files/${file.id}`, {
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = iframeSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleMenuClose();
    Notify({ message: 'File Downloaded', type: 'success' });
  };

  const handlePrivacy = async () => {
    try {
      const response = await axios.get(
        `${base}/Api/v1/files/private/${file.id}`,
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

  const handleEdit = () => {
    // Edit logic here
    handleMenuClose();
  };

  //   const handleOpen = () => {
  //     const params = { id: file.id, src: iframeSrc };
  //     /* navigate({
  //             pathname: '/view',
  //             Search: `?${createSearchParams(params)}`
  //         })*/
  //     navigate(`/viewfile?${createSearchParams(params)}`);
  //     handleMenuClose();
  //   };

  const handleShare = async () => {
    try {
      const response = await axios.get(
        `${base}/Api/v1/files/share/${file.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
    if (file.private == true) setOpen(true);
    else handleMenuClose();
  };

  let PrivateViewIcon;
  if (file.private == true) {
    PrivateViewIcon = LockIcon;
  } else PrivateViewIcon = LockOpenIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.9 }}
    >
      <div title={file.filename} className="card">
        <CardContent
          sx={{
            alignSelf: 'center',
          }}
        >
          <div onClick={() => handleOpenFile(file)}>{icon(file)}</div>
          <div className="filename">
            {' '}
            <div className="filetitle fname">{file.filename}</div>{' '}
          </div>
          <div className="filename">
            {' '}
            <div className="filetitle">Type:</div>{' '}
            <div className="filevalue">File</div>
          </div>
          <div className="filename">
            {' '}
            <div className="filetitle">Created:</div>{' '}
            <div className="filevalue">{file.created_at}</div>
          </div>
          <div className="filename">
            {' '}
            <div className="filetitle">Last updated:</div>{' '}
            <div className="filevalue">{file.updated_at}</div>
          </div>
          <div className="filename">
            {' '}
            <div className="filetitle">Acess</div>{' '}
            <div className="filevalue">
              {file && file.private ? 'Private' : 'Public'}
            </div>
          </div>

          {/*<div onClick={() => handleOpenFile(file)}>{icon(file)}</div>
          <div className="filename">{file.filename}</div>*/}
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
              <div className="menuitem"> Edit</div>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <DeleteForeverIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Delete</div>
            </MenuItem>
            <MenuItem onClick={handleShare}>
              <ShareIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Share</div>
            </MenuItem>
            <MenuItem onClick={handleDownload}>
              <FileDownloadIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Download</div>
            </MenuItem>
            <MenuItem onClick={handleShare}>
              <Groups2Icon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Collaborate</div>
            </MenuItem>
            <MenuItem onClick={handlePrivacy}>
              <PrivateViewIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              {file && file.private ? (
                <div className="menuitem">Private</div>
              ) : (
                <div className="menuitem">Public</div>
              )}
            </MenuItem>
            <MenuItem onClick={() => handleOpenFile(file)}>
              <InfoIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">File Details</div>
            </MenuItem>
          </Menu>
        </CardActions>
      </div>
      <ModalCore
        open={open}
        handleClose={handleCloseAll}
        view_type={'keyView'}
        value={file}
      />

      <AlertDialog
        title={'Alert'}
        message={`Delete ${file.filename} completely ?`}
        handleYes={handleYes}
        handleNo={handleNo}
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
      />
    </motion.div>
  );
};

File.propTypes = {
  file: PropTypes.array.isRequired,
  setStateChange: PropTypes.func.isRequired,
  handleOpenFile: PropTypes.func.isRequired,
};

export default File;
