import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FileDetailsDrawer from './FileDetailsDrawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FeedIcon from '@mui/icons-material/Feed';
import DownloadIcon from '@mui/icons-material/Download';
import DataViewer from './DataView';
import { Notify } from '../utils/Notification';
import Footer from './Footer';
import { Tooltip } from '@mui/material';
import '../css/dataview.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OpenViewFile = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [blobSrc, setBlobSrc] = useState('');
  const [item, setItem] = useState({});
  const [params, setParams] = useSearchParams();
  const id = params.get('id');
  const type = params.get('type');
  const files = useSelector(state => state.files);
  const texts = useSelector(state => state.texts);
  const src = params.get('src');
  const navigate = useNavigate();
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');

  // Helper function to convert text content to Blob URL
  const createTextBlobURL = textContent => {
    const blob = new Blob([textContent], { type: 'text/plain' });
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    const fetchFileBlob = async file_id => {
      try {
        if (!file_id) {
          console.error('No file Id provided to fetchFileBlob.');
          return;
        }

        const response = await axios.get(
          `${base}/Api/v1/files/download/${file_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
          }
        );

        if (response && response.data) {
          const src = URL.createObjectURL(response.data);
          setBlobSrc(src);
        } else {
          console.error('The response or response.data is undefined.');
        }
      } catch (error) {
        handleApiError(error);
      }
    };

    if (type === 'File') {
      if (src && src !== 'undefined') {
        setBlobSrc(src);
      } else {
        const file = files.find(file => file.id === parseInt(id));
        if (file && file.blob && Object.keys(file.blob).length > 0) {
          const url = URL.createObjectURL(file.blob);
          setBlobSrc(url);
        } else {
          fetchFileBlob(id);
        }
      }
    } else if (type === 'Text' || type === 'Script') {
      const text = texts.find(text => text.id === parseInt(id));
      if (text) {
        const url = createTextBlobURL(text.content);
        console.log('hereeeeeeeeeeeee', text.content);
        setBlobSrc(url);
      }
    }
  }, [id, type, files, texts, src, base, token]);

  useEffect(() => {
    const fetchFile = async file_id => {
      try {
        if (!file_id) {
          console.error('No file Id provided to fetchFile.');
          return;
        }

        const response = await axios.get(`${base}/Api/v1/files/${file_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response && response.data) {
          setItem(response.data.file);
        } else {
          console.error('The response or response.data is undefined.');
        }
      } catch (error) {
        handleApiError(error);
      }
    };

    const fetchText = async text_id => {
      try {
        if (!text_id) {
          console.error('No text Id provided to fetchText.');
          return;
        }

        const response = await axios.get(`${base}/Api/v1/texts/${text_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response && response.data) {
          setItem(response.data.text);
        } else {
          console.error('The response or response.data is undefined.');
        }
      } catch (error) {
        handleApiError(error);
      }
    };

    if (type === 'File') {
      const file = files.find(file => file.id === parseInt(id));
      if (file) {
        setItem(file);
      } else {
        fetchFile(id);
      }
    } else if (type === 'Text') {
      const text = texts.find(text => text.id === parseInt(id));
      if (text) {
        setItem(text);
      } else {
        fetchText(id);
      }
    }
  }, [id, type, files, texts, base, token]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = blobSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Notify({ message: 'File Downloaded', type: 'success' });
  };

  const handleApiError = error => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.msg === 'Token has expired'
    ) {
      navigate('/');
    } else if (error.response && error.response.data) {
      Notify({
        message: `${error.message}. ${error.response.data.message}`,
        type: 'error',
      });
    } else {
      Notify({
        message: `${error.message}. An unexpected error occurred.`,
        type: 'error',
      });
    }
  };

  return (
    <div className="opendataview">
      <div className="opeviewtoolbar">
        <div className="opeviewtoolbarContainer">
          <Tooltip title="Back" sx={{ marginRight: 0.5, marginLeft: 0.5 }}>
            <ArrowBackIcon
              className="tool"
              onClick={() => navigate(-1)}
              sx={{ fontSize: 50, color: '#fcfcfc', fontWeight: 1000 }}
            />
          </Tooltip>

          <Tooltip title="Details" sx={{ marginRight: 0.5, marginLeft: 0.5 }}>
            <FeedIcon
              className="tool"
              onClick={() => setDrawerOpen(true)}
              sx={{ fontSize: 50, color: '#fcfcfc', fontWeight: 1000 }}
            />
          </Tooltip>

          <Tooltip title="Download" sx={{ marginRight: 0.5, marginLeft: 0.5 }}>
            <DownloadIcon
              className="tool"
              onClick={handleDownload}
              sx={{ fontSize: 50, color: '#fcfcfc', fontWeight: 1000 }}
            />
          </Tooltip>
        </div>
      </div>

      <FileDetailsDrawer
        file={item}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        setParams={setParams}
      />
      <DataViewer file={item} src={blobSrc} type={type} />
      <Footer />
    </div>
  );
};

export default OpenViewFile;
