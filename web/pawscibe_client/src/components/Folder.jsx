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
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import { motion } from 'framer-motion';
import { Notify } from '../utils/Notification';
import IncludeModal from './IncludeModal'; // Import the modal component
import ExcludeModal from './ExcludeModal';
import AlertDialog from './Alert';
import '../css/folder.css';
import hashSHA256 from '../utils/hash';

const Folder = ({ folder, setStateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [includeAnchorEl, setIncludeAnchorEl] = useState(null); // State for include sub-menu
  const [excludeAnchorEl, setExcludeAnchorEl] = useState(null); // State for exclude sub-menu
  const [excludeType, setExcludeType] = useState(''); // State to store the exclude type
  const [modalOpen, setModalOpen] = useState(false);
  const [itemobj, setItemobj] = useState({});
  const [modalEOpen, setModalEOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenB, setDialogOpenB] = useState(false);
  const [dialogOpenC, setDialogOpenC] = useState(false);

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

  const handleOpenDialog = () => {
    handleMenuClose();
    setDialogOpen(true);
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
        `${base}/Api/v1/folders/${folder.id}/remove`,
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

  const handleOpenFolder = () => {
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
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Response:', response);
      console.log('Response type:', response.type);
      console.log('Response headers:', response.headers);
      // Convert the response to a Blob
      //const blob = await response.blob();
      const blob = new Blob([response.data], { type: 'application/zip' });

      // Create a URL for the blob and simulate a click to download the file
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${folder.foldername}.zip`; // Set the download filename
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up the link element

      // Revoke the object URL after the download
      window.URL.revokeObjectURL(downloadUrl);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    setDialogOpen(false);
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

  const handleExcludeNo = () => {
    setExcludeType('');
    setDialogOpenB(false);
  };

  const handleOpenDel = () => {
    handleMenuClose();
    setDialogOpenC(true);
  };

  const handleExcludeDialog = item => {
    setItemobj(item);
    setModalEOpen(false);
    setDialogOpenB(true);
  };

  const handleSelectExclude = async () => {
    console.log(itemobj);
    try {
      const response = await axios.delete(
        `${base}/Api/v1/folders/${itemobj.fx.id}/exclude`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Notify({ message: response.data.message, type: 'success' });
      setExcludeType('');
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
      setDialogOpenB(false);
    }
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
        <CardContent
          sx={{
            alignSelf: 'center',
          }}
        >
          <FolderIcon
            sx={{
              fontSize: 100,
              color: '#616161',
              fontWeight: 1000,
              ':hover': { color: '#878787' },
            }}
            onClick={handleOpenFolder}
          />
          <div className="foldername">
            {' '}
            <div className="foldertitle foldname">{folder.foldername}</div>{' '}
          </div>
          <div className="foldername">
            {' '}
            <div className="foldertitle">Type</div>{' '}
            <div className="foldervalue">Folder</div>
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

            <MenuItem onClick={handleOpenDialog}>
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

            <MenuItem onClick={handleOpenDel}>
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
        onSelect={handleExcludeDialog}
        folderId={folder.id}
      />
      <AlertDialog
        title={'Download'}
        message={`Download ${folder.foldername} and all its content ?`}
        handleYes={handleDownload}
        handleNo={() => setDialogOpen(false)}
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
      />
      <AlertDialog
        title={'Delete Folder and Content'}
        message={`Delete ${itemobj ? itemobj.foldername : 'FOLD'} and Contents of ${itemobj ? itemobj.foldername : 'FOLD'} from ${folder.foldername} `}
        handleYes={handleSelectExclude}
        handleNo={handleExcludeNo}
        open={dialogOpenB}
        handleClose={() => setDialogOpenB(false)}
      />
      <AlertDialog
        title={'Delete Folder and Content'}
        message={`Delete ${folder.foldername} and it's contents`}
        handleYes={handleDelete}
        handleNo={() => setDialogOpenC(false)}
        open={dialogOpenC}
        handleClose={() => setDialogOpenC(false)}
      />
    </motion.div>
  );
};

Folder.propTypes = {
  folder: PropTypes.object.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default Folder;
