import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FeedIcon from '@mui/icons-material/Feed';
import ImageIcon from '@mui/icons-material/Image';
import codeIcon from '../utils/codeIcon';
import IncludeCard from './IncludeCard';
import New from './New';
//import PublicIcon from '@mui/icons-material/Public';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  TextField,
  Grid,
  //IconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { Notify } from '../utils/Notification';
import axios from 'axios';
import '../css/include.css';
//import SkeletonLoading from './Skeleton';

const FileInclude = ({ onSelect, setModalOpen }) => {
  const filesIn = useSelector(state => state.files);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);

  const [files, setFiles] = useState(filesIn);
  //const [stateChanged, setstateChanged] = useState(false);
  const [page, setPage] = useState(1); // Manage current page
  const [totalPages, setTotalPages] = useState(1); // Manage total pages
  //const [loading, setLoading] = useState(true);    // Loading state
  const [typingTimeout, setTypingTimeout] = useState(0); // Debounce typing

  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const navigate = useNavigate();

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

  if (!token) navigate('/');

  const fetchFiles = async (searchQuery = '', page = 1) => {
    //setLoading(true);
    try {
      const response = await axios.get(`${base}/Api/v1/files/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          match: searchQuery, // Search query
          page, // Current page
          per_page: 10, // Files per page
        },
      });

      const { files, pages } = response.data;

      setFiles(files);
      setFilteredFiles(files);
      setTotalPages(pages);
      //setLoading(false);
    } catch (error) {
      //setLoading(false);
      Notify({
        message: `${error.message}. ${error.response?.data?.message || ''}`,
        type: 'error',
      });
    }
  };

  const handleNext = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrev = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  const handleSearchChange = e => {
    const value = e.target.value;
    setSearchTerm(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        if (value !== '') fetchFiles(value, 1); // Reset to first page on new query
      }, 500)
    ); // Wait for 500ms before making the API request
  };

  useEffect(() => {
    const searchList = files.filter(file =>
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (searchList.length >= 10 || searchTerm === '') {
      setFilteredFiles(searchList);
    } else {
      fetchFiles(searchTerm, page);
    }
  }, [searchTerm, page]);

  return (
    <div>
      <div className="bar">
        <TextField
          className="searchInclude"
          label="Search Files"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="pagenav">
          <Tooltip title="Previous" sx={{ marginRight: 0.5, marginLeft: 0.5 }}>
            <IconButton onClick={handlePrev} disabled={page === 1}>
              <SkipPreviousIcon sx={{ fontSize: 50, color: '#fcfcfc' }} />
            </IconButton>
          </Tooltip>

          <div className="pagenavstat">
            Page {page} of {totalPages}
          </div>
          <Tooltip title="Next" sx={{ marginRight: 0.5, marginLeft: 0.5 }}>
            <IconButton onClick={handleNext} disabled={page === totalPages}>
              <SkipNextIcon sx={{ fontSize: 50, color: '#fcfcfc' }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <Grid container spacing={2}>
        <New type={'File'} setModalOpen={setModalOpen} onSelect={onSelect} />
        {filteredFiles.map(file => (
          <Grid item xs={3} key={file.id}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.9 }}
            >
              <IncludeCard icon={icon} file={file} onSelect={onSelect} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

FileInclude.propTypes = {
  onSelect: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

export default FileInclude;
