import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import OpenFolderList from './OpenFolderList';
import { useSelector } from 'react-redux';
import Appbar from './Appbar';
import Footer from './Footer';
import { Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importing icons from Material-UI
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import '../css/openfolderview.css';
const OpenFolderView = ({ setStateChange, stateChanged }) => {
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [files, setFiles] = useState([]);
  const [texts, setTexts] = useState([]);
  const [subfolders, setSubfolders] = useState([]);
  const blobs = useSelector(state => state.fileBlobs);
  const folderId = searchParams.get('folderId');
  const folder = useSelector(state =>
    state.folders.find(f => f.id.toString() === folderId)
  );

  const navigate = useNavigate();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

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

    // Check if the user can navigate back or forward
    setCanGoBack(window.history.state && window.history.state.idx > 0);
    setCanGoForward(
      window.history.state &&
        window.history.state.idx < window.history.length - 1
    );
  }, [folderId, blobs]);

  // Handler for back navigation
  const handleBack = () => {
    if (canGoBack) {
      navigate(-1);
    }
  };

  // Handler for forward navigation
  const handleForward = () => {
    if (canGoForward) {
      navigate(1);
    }
  };

  return (
    <div className="dashboard openfolderview">
      <Appbar setSearchValue={setSearchValue} />
      <div className="container">
        <div
          style={{ display: 'flex', alignItems: 'center', paddingBottom: '2%' }}
        >
          <h1>{folder?.foldername}</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <Tooltip
              title="Previous"
              sx={{ marginRight: 0.5, marginLeft: 0.5 }}
            >
              <IconButton onClick={handleBack} disabled={!canGoBack}>
                <ArrowBackIcon sx={{ fontSize: 50, color: '#616161' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Next" sx={{ marginRight: 0.5, marginLeft: 0.5 }}>
              <IconButton onClick={handleForward} disabled={!canGoForward}>
                <ArrowForwardIcon sx={{ fontSize: 50, color: '#616161' }} />
              </IconButton>
            </Tooltip>
          </div>
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
    </div>
  );
};

OpenFolderView.propTypes = {
  setStateChange: PropTypes.func.isRequired,
  stateChanged: PropTypes.bool.isRequired,
};

export default OpenFolderView;
