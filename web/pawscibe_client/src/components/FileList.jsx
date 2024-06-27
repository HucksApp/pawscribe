import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import FileView from './FileView';
import FileStats from './FileStat';
import AddFile from './AddFile';
import { Notify } from '../utils/Notification';

const FileList = ({
  searchValue,
  stateChanged,
  setStateChange,
  files,
  setFiles,
}) => {
  const [filteredFiles, setFilteredFiles] = useState([]);

  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');

  const fetchFiles = async () => {
    const response = await axios.get(base + '/Api/v1/files/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFiles(response.data);
    setFilteredFiles(response.data);
    setStateChange(false);
    console.log(response.data, '================');
  };

  useEffect(() => {
    try {
      fetchFiles();
    } catch (error) {
      Notify({ message: error.message, type: 'error' });
    }
  }, [stateChanged]);
  useEffect(() => {
    if (searchValue) {
      //setSearchTerm(searchValue);
      setFilteredFiles(
        files.filter(file => file.filename.toLowerCase().includes(searchValue))
      );
    } else {
      setFilteredFiles(files);
    }
  }, [searchValue]);

  return (
    <div className="listcontainer">
      <Container>
        {files && <FileStats files={filteredFiles} />}
        <Grid container spacing={3}>
          <AnimatePresence>
            <AddFile fetchFiles={fetchFiles} setStateChange={setStateChange} />
            {filteredFiles.map(file => (
              <Grid item key={file.id} xs={8} sm={4} md={2}>
                <FileView file={file} setStateChange={setStateChange} />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>
    </div>
  );
};

export default FileList;
