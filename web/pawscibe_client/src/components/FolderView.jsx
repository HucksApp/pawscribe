import React, { useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
//import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import { motion } from 'framer-motion';
import { Notify } from '../utils/Notification';
import IncludeModal from './IncludeModal'; // Import the modal component
import ExcludeModal from './ExcludeModal';
import '../css/folderview.css';
import hashSHA256 from '../utils/hash';

const FolderView = ({ folder, setStateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [includeAnchorEl, setIncludeAnchorEl] = useState(null); // State for include sub-menu
  const [excludeAnchorEl, setExcludeAnchorEl] = useState(null); // State for exclude sub-menu
  const [excludeType, setExcludeType] = useState(''); // State to store the exclude type
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEOpen, setModalEOpen] = useState(false);
  const [includeType, setIncludeType] = useState(''); // State to store the include type
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const navigate = useNavigate();

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleIncludeMenuOpen = event => {
    setIncludeAnchorEl(event.currentTarget);
  };

  const handleIncludeMenuClose = () => {
    setIncludeAnchorEl(null);
  };

  const handleExcludeMenuOpen = event => {
    setExcludeAnchorEl(event.currentTarget);
  };

  const handleExcludeMenuClose = () => {
    setExcludeAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${base}/Api/v1/folders/${folder.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Notify({ message: response.data.message, type: 'success' });
      setStateChange(true);
    } catch (error) {
      if (
        error.response.data.msg &&
        error.response.data.msg === 'Token has expired'
      )
        navigate('/');
      else
        Notify({
          message: `${error.message}. ${error.response.data.message}`,
          type: 'error',
        });
    }
    handleMenuClose();
  };

  const handleOpenFolderView = () => {
    navigate(`/openFolder?folderId=${folder.id}`);
  };

  const handleEdit = () => {
    // Edit logic here
    handleMenuClose();
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${base}/Api/v1/folders/${folder.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    handleMenuClose();
  };

  const handleOpen = () => {
    const params = { id: folder.id };
    navigate(`/viewfolder?${createSearchParams(params)}`);
    handleMenuClose();
  };

  const handleInclude = type => {
    setIncludeType(type);
    setModalOpen(true);
    handleIncludeMenuClose();
    handleMenuClose();
  };
  const handleExclude = type => {
    setExcludeType(type);
    setModalEOpen(true);
    handleExcludeMenuClose();
    handleMenuClose();
  };

  const handleSelectExclude = async item => {
    console.log(item);
  };

  const handleSelect = async item => {
    const getPayLoad = async () => {
      const payload = {
        parent_folder_id: folder.id,
        type: includeType,
        [`${includeType.toLowerCase()}_id`]: item.id,
      };

      if (includeType === 'Text') {
        // Logic for handling Text type
        const textHash = hashSHA256(item.content);
        if (textHash !== item.hash) {
          payload.content = item.content;
        } else {
          payload.hash = item.hash;
        }
      } else if (includeType === 'File') {
        // Check if the file is an image
        if (item.fileBlob && item.fileBlob.type.startsWith('image/')) {
          // Since it's an image, we just send the ID and the existing hash
          payload.hash = item.hash;
        } else {
          // If it's a non-image file (e.g., text file), we read the content
          try {
            const fileContent = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = e => resolve(e.target.result);
              reader.onerror = () => reject('Failed to read file content');
              reader.readAsText(item.fileBlob);
            });

            const fileHash = hashSHA256(fileContent);
            if (fileHash !== item.hash) {
              payload.content = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve(reader.result.split(',')[1]); // Get only Base64 part
                };
                reader.onerror = () => reject('File Inclusion Failed');
                reader.readAsDataURL(item.fileBlob); // Converts to Base64 string
              });
            } else {
              payload.hash = item.hash;
            }
          } catch (error) {
            throw new Error('File processing failed');
          }
        }
      } else if (includeType === 'Folder') {
        console.log('folder');
      }

      return payload;
    };

    try {
      const payload = await getPayLoad();
      console.log(payload);

      const response = await axios.post(
        `${base}/Api/v1/folders/include`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Notify({ message: response.data.message, type: 'success' });
      setIncludeType('');
      setStateChange(true);
    } catch (error) {
      if (error.response) {
        if (error.response.data.msg === 'Token has expired') {
          navigate('/');
        } else {
          Notify({
            message: `${error.message}. ${error.response.data.message}`,
            type: 'error',
          });
        }
      } else {
        Notify({
          message: `${error.message}`,
          type: 'error',
        });
      }
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.9 }}
    >
      <div title={folder.foldername} className="card">
        <FolderIcon
          sx={{
            fontSize: 100,
            color: '#616161',
            fontWeight: 1000,
            alignSelf: 'center',
            ':hover': { color: '#878787' },
          }}
          onClick={handleOpenFolderView}
        />
        <CardContent>
          <div className="foldername">
            {' '}
            <div className="foldertitle foldname">{folder.foldername}</div>{' '}
          </div>
          <div className="foldername">
            {' '}
            <div className="foldertitle">Created:</div>{' '}
            <div className="foldervalue">{folder.created_at}</div>
          </div>
          <div className="foldername">
            {' '}
            <div className="foldertitle">Last updated:</div>{' '}
            <div className="foldervalue">{folder.updated_at}</div>
          </div>
          <div className="foldername">
            {' '}
            <div className="foldertitle">Description</div>{' '}
            <div className="foldervalue">
              {folder.description ? folder.description : 'None'}
            </div>
          </div>
          <div className="foldername">
            {' '}
            <div className="foldertitle">language</div>{' '}
            <div className="foldervalue">
              {folder.language ? folder.language : 'None'}
            </div>
          </div>
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

            <MenuItem onClick={handleIncludeMenuOpen}>
              <LibraryAddIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Include</div>
            </MenuItem>
            <MenuItem onClick={handleExcludeMenuOpen}>
              <DisabledByDefaultIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Exclude</div>
            </MenuItem>

            <MenuItem onClick={handleDownload}>
              <FolderZipIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Download</div>
            </MenuItem>

            <MenuItem onClick={() => navigate(`/editor?folderId=${folder.id}`)}>
              <FileOpenIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Open in Code Editor</div>
            </MenuItem>

            <MenuItem onClick={handleIncludeMenuOpen}>
              <ImportContactsIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Open </div>
            </MenuItem>

            <MenuItem onClick={handleDelete}>
              <FolderDeleteIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Delete</div>
            </MenuItem>
            <MenuItem onClick={handleOpen}>
              <InfoIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Folder Details</div>
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={includeAnchorEl}
            open={Boolean(includeAnchorEl)}
            onClose={handleIncludeMenuClose}
            className="multimenu"
          >
            <MenuItem onClick={() => handleInclude('Folder')}>
              <div className="menuitem">
                Include <span>Folder</span>
              </div>
            </MenuItem>
            <MenuItem onClick={() => handleInclude('File')}>
              <div className="menuitem">
                Include <span>File</span>{' '}
              </div>
            </MenuItem>
            <MenuItem onClick={() => handleInclude('Text')}>
              <div className="menuitem">
                Include <span>Script</span>
              </div>
            </MenuItem>
          </Menu>
          <Menu
            anchorEl={excludeAnchorEl}
            open={Boolean(excludeAnchorEl)}
            onClose={handleExcludeMenuClose}
            className="multimenu"
          >
            <MenuItem onClick={() => handleExclude('Folder')}>
              <div className="menuitem">
                Exclude <span>Folder</span>
              </div>
            </MenuItem>
            <MenuItem onClick={() => handleExclude('File')}>
              <div className="menuitem">
                Exclude <span>File</span>
              </div>
            </MenuItem>
            <MenuItem onClick={() => handleExclude('Text')}>
              <div className="menuitem">
                Exclude <span>Script</span>
              </div>
            </MenuItem>
          </Menu>
        </CardActions>
      </div>
      <IncludeModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        includeType={includeType}
        onSelect={handleSelect}
      />
      <ExcludeModal
        open={modalEOpen}
        handleClose={() => setModalEOpen(false)}
        excludeType={excludeType}
        onSelect={handleSelectExclude}
        folderId={folder.id}
      />
    </motion.div>
  );
};

FolderView.propTypes = {
  folder: PropTypes.object.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default FolderView;
