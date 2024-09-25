import React, { useState, useEffect } from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FeedIcon from '@mui/icons-material/Feed';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PropTypes from 'prop-types';
import {
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  //IconButton,
} from '@mui/material';
import '../css/include.css';

import { useSelector } from 'react-redux';
import codeIcon from '../utils/codeIcon';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { Notify } from '../utils/Notification';
import axios from 'axios';

const TextInclude = ({ onSelect }) => {
  const textsIn = useSelector(state => state.texts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredtexts, setFilteredtexts] = useState([]);

  const [texts, setTexts] = useState(textsIn);

  const [page, setPage] = useState(1); // Manage current page
  const [totalPages, setTotalPages] = useState(1); // Manage total pages
  const [typingTimeout, setTypingTimeout] = useState(0); // Debounce typing

  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const navigate = useNavigate();

  if (!token) navigate('/');

  const fetchTexts = async (searchQuery = '', page = 1) => {
    //setLoading(true);
    try {
      const response = await axios.get(`${base}/Api/v1/texts/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          match: searchQuery, // Search query
          page, // Current page
          per_page: 10, // Files per page
        },
      });

      const { texts, pages } = response.data;

      setTexts(texts);
      setFilteredtexts(texts);
      setTotalPages(pages);
    } catch (error) {
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
        if (value !== '') fetchTexts(value, 1); // Reset to first page on new query
      }, 500)
    ); // Wait for 500ms before making the API request
  };

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

  useEffect(() => {
    const searchList = texts.filter(text =>
      text.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (searchList.length >= 10 || searchTerm === '') {
      setFilteredtexts(searchList);
    } else {
      fetchTexts(searchTerm, page);
    }
  }, [searchTerm, page]);

  return (
    <div>
      <div className="bar">
        <TextField
          className="searchInclude"
          label="Search Scripts"
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
        {filteredtexts.map(text => (
          <Grid item xs={3} key={text.id}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.9 }}
            >
              <Card onClick={() => onSelect(text)}>
                <CardContent>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    {icon(text)}
                    <Typography
                      sx={{
                        fontSize: 25,
                        color: '#616161',
                        fontFamily: 'Raleway',
                        fontWeight: 1000,
                      }}
                      variant="h6"
                    >
                      {text.file_type}
                    </Typography>
                  </div>
                  <iframe
                    src={URL.createObjectURL(new Blob([text.content]))}
                    style={{ width: '100%', height: '100px', border: 'none' }}
                    title={text.file_type}
                  ></iframe>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

TextInclude.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default TextInclude;
