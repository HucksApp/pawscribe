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
import { useSelector, useDispatch } from 'react-redux';
import { setFiles } from '../store/fileSlice';
import SkeletonLoading from './Skeleton';
import { clearUser } from '../store/userSlice';

const FileList = ({ searchValue, stateChanged, setStateChange }) => {
  const [filteredFiles, setFilteredFiles] = useState([]);

  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const files = useSelector(state => state.files);

  if (!token) navigate('/');

  const fetchFiles = async () => {
    try {
      const response = await axios.get(base + '/Api/v1/files/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(
        setFiles(
          [...response.data].sort((a, b) =>
            a.filename.localeCompare(b.filename)
          )
        )
      );
      setFilteredFiles(
        [...response.data].sort((a, b) => a.filename.localeCompare(b.filename))
      );
      setStateChange(false);
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
    fetchFiles();
  }, [stateChanged]);
  useEffect(() => {
    if (searchValue) {
      //setSearchTerm(searchValue);
      setFilteredFiles(
        [...files]
          .filter(file => file.filename.toLowerCase().includes(searchValue))
          .sort((a, b) => a.filename.localeCompare(b.filename))
      );
    } else {
      setFilteredFiles(files);
    }
  }, [searchValue]);

  if (!files) return <SkeletonLoading />;
  else if (
    files &&
    Array.isArray(files) &&
    files.length < 1 &&
    pathname == '/files'
  )
    return (
      <Container>
        <AddFile setStateChange={setStateChange} />
        <NoContent msg="No File is Present" />
      </Container>
    );
  else if (files && Array.isArray(files) && files.length < 1) return;
  return (
    <div className="listcontainer">
      <Container sx={{ overflow: 'scroll' }}>
        {files && <FileStats files={filteredFiles} />}
        <Grid container spacing={3}>
          <AnimatePresence>
            <AddFile setStateChange={setStateChange} />
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
  searchValue: PropTypes.string.isRequired,
  stateChanged: PropTypes.bool.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default FileList;
