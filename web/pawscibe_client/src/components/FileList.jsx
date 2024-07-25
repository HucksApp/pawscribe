import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import FileView from './FileView';
import FileStats from './FileStat';
import AddFile from './AddFile';
import { Notify } from '../utils/Notification';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import NoContent from './NoContent';
import { useNavigate } from 'react-router-dom';

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
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  if (!token) navigate('/');

  const fetchFiles = async () => {
    try {
      const response = await axios.get(base + '/Api/v1/files/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFiles(response.data);
      setFilteredFiles(response.data);
      setStateChange(false);
    } catch (error) {
      Notify({
        message: `${error.message}. ${error.response.data.message} `,
        type: 'error',
      });
    }
  };

  useEffect(() => {
    fetchFiles();
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
  if (!files.length && pathname == '/files')
    return (
      <Container>
        <AddFile setStateChange={setStateChange} />
        <NoContent msg="No File is Present" />
      </Container>
    );
  else if (!files.length) return;
  return (
    <div className="listcontainer">
      <Container>
        {files && <FileStats files={filteredFiles} />}
        <Grid container spacing={3}>
          <AnimatePresence>
            <AddFile fetchFiles={fetchFiles} setStateChange={setStateChange} />
            {filteredFiles.map(file => (
              <Grid item key={file.id} xs={8} sm={4} md={2}>
                <FileView
                  file={file}
                  setStateChange={setStateChange}
                  stateChanged={stateChanged}
                />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>
    </div>
  );
};

FileList.propTypes = {
  searchValue: PropTypes.func.isRequired,
  stateChanged: PropTypes.func.isRequired,
  setStateChange: PropTypes.func.isRequired,
  files: PropTypes.func.isRequired,
  setFiles: PropTypes.func.isRequired,
};

export default FileList;
