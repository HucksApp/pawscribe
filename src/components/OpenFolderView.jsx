import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OpenFolderList from './OpenFolderList';
import { useSelector } from 'react-redux';
import Appbar from './Appbar';
import Footer from './Footer';
import { Tooltip, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importing icons from Material-UI
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import '../css/openfolderview.css';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IncludeModal from './IncludeModal';
import { Notify } from '../utils/Notification';
import hashSHA256 from '../utils/hash';

const OpenFolderView = () => {
  const [includeAnchorEl, setIncludeAnchorEl] = useState(null); // State for include sub-menu
  const [includeType, setIncludeType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [files, setFiles] = useState([]);
  const [stateChanged, setStateChange] = useState(false);
  const [texts, setTexts] = useState([]);
  const [subfolders, setSubfolders] = useState([]);
  const blobs = useSelector(state => state.fileBlobs);
  const folderId = searchParams.get('folderId');

  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');

  const handleIncludeMenuClose = () => {
    setIncludeAnchorEl(null);
  };
  const handleIncludeMenuOpen = event => {
    setIncludeAnchorEl(event.currentTarget);
  };

  const handleInclude = type => {
    setIncludeType(type);
    console.log(includeType);
    setModalOpen(true);
    handleIncludeMenuClose();
    //handleMenuClose();
  };

  const handleSelect = async item => {
    console.log(
      item,
      `item ====>${item}\n`,
      `include type ++++>${includeType}`
    );
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
        } else if (item.fileBlob) {
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
        } else if (item.new) {
          payload.content = '';
          payload.name = item.name;
          payload.blank = item.new;
          delete payload[`${includeType.toLowerCase()}_id`];
        }
      } else if (includeType === 'Folder') {
        payload.name = item.name;
      }

      return payload;
    };

    try {
      const payload = await getPayLoad();
      console.log(
        payload,
        '=====================================================>'
      );

      const response = await axios.post(
        `${base}/Api/v1/folders/include`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIncludeType('');
      setStateChange(!stateChanged);
      Notify({ message: response.data.message, type: 'success' });
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

  const folder = useSelector(state =>
    state.folders.find(f => f.id.toString() === folderId)
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolderContents = async () => {
      const base = process.env.REACT_APP_BASE_API_URL;
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await axios.get(
          `${base}/Api/v1/folders/${folderId}/children`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data, blobs, 'response ===>');

        const files_xblob = response.data.children.files.map(fileSerial => {
          const fileblob = blobs.find(
            blob => blob.id === fileSerial.id.toString()
          );
          console.log(fileblob, 'file blob');
          return { ...fileSerial, blob: fileblob?.blob };
        });
        console.log(files_xblob, 'file and blob');
        setFiles(files_xblob);
        setTexts(response.data.children.texts);
        setSubfolders(response.data.children.sub_folders);
        console.log(folder, '\n\n', files, '\n\n', texts, '\n\n', subfolders);
      } catch (error) {
        console.error('Failed to fetch folder contents:', error);
      }
    };

    fetchFolderContents();
    console.log('ssssssssssss', stateChanged);
  }, [folderId, blobs, stateChanged]);

  return (
    <div className="dashboard openfolderview">
      <Appbar setSearchValue={setSearchValue} />
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '2%',
          }}
        >
          <h1>{folder?.foldername}</h1>
          <div className="openfoldernav">
            <Tooltip title="Include">
              <IconButton onClick={handleIncludeMenuOpen}>
                <AddBoxIcon
                  sx={{ fontSize: 50, color: '#616161', fontWeight: 1000 }}
                />
              </IconButton>
            </Tooltip>
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                gap: '10px',
                backgroundColor: '#616161',
              }}
            >
              <Tooltip
                title="Previous"
                sx={{ marginRight: 0.5, marginLeft: 0.5 }}
              >
                <IconButton onClick={() => navigate(-1)}>
                  <ArrowBackIcon sx={{ fontSize: 50, color: '#fcfcfc' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Next" sx={{ marginRight: 0.5, marginLeft: 0.5 }}>
                <IconButton onClick={() => navigate(1)}>
                  <ArrowForwardIcon sx={{ fontSize: 50, color: '#fcfcfc' }} />
                </IconButton>
              </Tooltip>
            </div>
          </div>

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
        </div>
        <OpenFolderList
          searchValue={searchValue}
          files={files}
          subfolders={subfolders}
          texts={texts}
          setStateChange={setStateChange}
          stateChanged={stateChanged}
        />
      </div>
      <Footer />
      <IncludeModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        includeType={includeType}
        onSelect={handleSelect}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};

export default OpenFolderView;
