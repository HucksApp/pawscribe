import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FeedIcon from '@mui/icons-material/Feed';
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
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useNavigate } from 'react-router-dom';
import { Notify } from '../utils/Notification';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice';
import codeIcon from '../utils/codeIcon';
import { motion } from 'framer-motion';

const TextExclude = ({ onSelect, folderId }) => {
  const [texts, setTexts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredtexts, setFilteredtexts] = useState([]);
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const fetchFolderScripts = async () => {
    try {
      const response = await axios.get(
        `${base}/Api/v1/folders/${folderId}/texts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setTexts(
        [...response.data.texts].sort((a, b) =>
          a.content.localeCompare(b.content)
        )
      );
      setFilteredtexts(
        [...response.data.texts].sort((a, b) =>
          a.content.localeCompare(b.content)
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
    fetchFolderScripts();
  }, []);

  useEffect(() => {
    setFilteredtexts(
      texts.filter(text =>
        text.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, texts]);

  return (
    <div>
      <TextField
        label="Search Scrips"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
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

TextExclude.propTypes = {
  onSelect: PropTypes.func.isRequired,
  folderId: PropTypes.number.isRequired,
};

export default TextExclude;
