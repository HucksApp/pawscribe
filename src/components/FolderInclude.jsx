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
import { useSelector } from 'react-redux';
import FolderIcon from '@mui/icons-material/Folder';
import { motion } from 'framer-motion';
import New from './New';

const FolderInclude = ({ onSelect, setModalOpen }) => {
  const folders = useSelector(state => state.folders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFolders, setFilteredFolders] = useState([]);

  useEffect(() => {
    setFilteredFolders(
      folders.filter(folder =>
        folder.foldername.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, folders]);

  return (
    <div>
      <div className="bar">
        <TextField
          label="Search Folders"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <Grid container spacing={2}>
        <New type={'Folder'} setModalOpen={setModalOpen} onSelect={onSelect} />
        {filteredFolders.map(folder => (
          <Grid item xs={3} key={folder.id}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.9 }}
            >
              <Card
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&:hover': {
                    opacity: 0.9,
                    cursor: 'pointer',
                  },
                }}
                onClick={() => onSelect(folder)}
              >
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
                      fontSize: 15,
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

FolderInclude.propTypes = {
  onSelect: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

export default FolderInclude;
