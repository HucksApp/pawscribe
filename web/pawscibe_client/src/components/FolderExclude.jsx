import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  //IconButton,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Notify } from '../utils/Notification';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice';
import FolderIcon from '@mui/icons-material/Folder';
import { motion } from 'framer-motion';

const FolderExclude = ({ onSelect, folderId }) => {
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const [folders, setFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFolders, setFilteredFolders] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchFolderSubfolders = async () => {
    try {
      const response = await axios.get(
        `${base}/Api/v1/folders/${folderId}/subfolders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setFolders(
        [...response.data.folders].sort((a, b) =>
          a.foldername.localeCompare(b.foldername)
        )
      );
      setFilteredFolders(
        [...response.data.folders].sort((a, b) =>
          a.foldername.localeCompare(b.foldername)
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
    fetchFolderSubfolders();
  }, []);

  useEffect(() => {
    setFilteredFolders(
      folders.filter(folder =>
        folder.foldername.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, folders]);

  return (
    <div>
      <TextField
        label="Search Folders"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2}>
        {filteredFolders.map(folder => (
          <Grid item xs={3} key={folder.id}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.9 }}
            >
              <Card onClick={() => onSelect(folder)}>
                <CardContent>
                  <FolderIcon
                    sx={{
                      fontSize: 50,
                      color: '#616161',
                      fontWeight: 1000,
                    }}
                    style={{ fontSize: 50 }}
                  />
                  <Typography
                    sx={{
                      fontSize: 25,
                      color: '#616161',
                      fontFamily: 'Raleway',
                      fontWeight: 1000,
                    }}
                    variant="h6"
                  >
                    {folder.foldername}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

FolderExclude.propTypes = {
  onSelect: PropTypes.func.isRequired,
  folderId: PropTypes.number.isRequired,
};

export default FolderExclude;
