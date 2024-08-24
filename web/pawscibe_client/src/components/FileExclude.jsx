import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FeedIcon from '@mui/icons-material/Feed';
import ImageIcon from '@mui/icons-material/Image';
import codeIcon from '../utils/codeIcon';
import ExcludeCard from './ExcludeCard';
import { useNavigate } from 'react-router-dom';
import { Notify } from '../utils/Notification';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice';
//import PublicIcon from '@mui/icons-material/Public';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  TextField,
  Grid,
  //IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';

const FileExclude = ({ onSelect, folderId }) => {
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);
  const dispatch = useDispatch();
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

  const fetchFolderFiles = async () => {
    try {
      const response = await axios.get(
        `${base}/Api/v1/folders/${folderId}/files`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setFiles(
        [...response.data.files].sort((a, b) =>
          a.filename.localeCompare(b.filename)
        )
      );
      setFilteredFiles(
        [...response.data.files].sort((a, b) =>
          a.filename.localeCompare(b.filename)
        )
      );
    } catch (error) {
      if (error.response)
        if (
          error.response.data.msg &&
          error.response.data.msg === 'Token has expired'
        ) {
          localStorage.removeItem('jwt_token');
          dispatch(clearUser());
          navigate('/');
        } else
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

  useEffect(() => {
    fetchFolderFiles();
  }, []);

  useEffect(() => {
    setFilteredFiles(
      files.filter(file =>
        file.filename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, files]);

  return (
    <div>
      <TextField
        label="Search Files"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2}>
        {filteredFiles.map(file => (
          <Grid item xs={3} key={file.id}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.9 }}
            >
              <ExcludeCard icon={icon} file={file} onSelect={onSelect} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

FileExclude.propTypes = {
  onSelect: PropTypes.func.isRequired,
  folderId: PropTypes.number.isRequired,
};

export default FileExclude;
