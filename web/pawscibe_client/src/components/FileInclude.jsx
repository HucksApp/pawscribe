import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FeedIcon from '@mui/icons-material/Feed';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import IncludeCard from './IncludeCard';
//import PublicIcon from '@mui/icons-material/Public';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  TextField,
  Grid,
  //IconButton,
} from '@mui/material';
import {
  //Css,
  Javascript,
  //Html,
  //Php,
  //Terminal,
  // Lock,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const FileInclude = ({ onSelect }) => {
  const files = useSelector(state => state.files);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);

  const icon = file => {
    switch (file.filename.split('.').pop()) {
      case 'py':
        return (
          <CodeIcon
            sx={{
              fontSize: 40,
              color: '#3776AB',
              fontWeight: 1000,
            }}
          />
        );
      case 'js':
        return (
          <Javascript
            sx={{
              fontSize: 40,
              color: '#F7DF1E',
              fontWeight: 1000,
            }}
          />
        );

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
};

export default FileInclude;
