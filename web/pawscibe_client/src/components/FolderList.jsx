import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import FolderView from './FolderView';
import AddFolder from './AddFolder';
import { Notify } from '../utils/Notification';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import NoContent from './NoContent';
import { useNavigate } from 'react-router-dom';
import FolderStats from './FolderStat';
import { useSelector, useDispatch } from 'react-redux';
import { setFolders } from '../store/folderSlice';
import SkeletonLoading from './Skeleton';
import { clearUser } from '../store/userSlice';

const FolderList = ({ searchValue, stateChanged, setStateChange }) => {
  const [filteredFolders, setFilteredFolders] = useState([]);
  const folders = useSelector(state => state.folders);

  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!token) navigate('/');

  const fetchFolders = async () => {
    try {
      const response = await axios.get(base + '/Api/v1/folders/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      dispatch(
        setFolders(
          [...response.data].sort((a, b) =>
            a.foldername.localeCompare(b.foldername)
          )
        )
      );
      setFilteredFolders(
        [...response.data].sort((a, b) =>
          a.foldername.localeCompare(b.foldername)
        )
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
    fetchFolders();
  }, [stateChanged]);

  useEffect(() => {
    if (searchValue) {
      setFilteredFolders(
        [...folders]
          .filter(folder =>
            folder.foldername.toLowerCase().includes(searchValue.toLowerCase())
          )
          .sort((a, b) => a.foldername.localeCompare(b.foldername))
      );
    } else {
      setFilteredFolders(folders);
    }
  }, [searchValue]);

  if (!folders) return <SkeletonLoading />;
  else if (
    folders &&
    Array.isArray(folders) &&
    folders.length < 1 &&
    pathname == '/folders'
  )
    return (
      <Container>
        <AddFolder setStateChange={setStateChange} />
        <NoContent msg="No Folder is Present" />
      </Container>
    );
  else if (!folders.length) return null;
  else if (folders && Array.isArray(folders) && folders.length < 1) return;
  return (
    <div className="listcontainer folderlistcontainer">
      <Container sx={{ overflow: 'scroll' }}>
        {folders && <FolderStats type="FOLDERS" folders={filteredFolders} />}
        <Grid container spacing={3}>
          <AnimatePresence>
            <AddFolder setStateChange={setStateChange} />
            {filteredFolders.map(folder => (
              <Grid item key={folder.id} xs={8} sm={4} md={2}>
                <FolderView
                  folder={folder}
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

FolderList.propTypes = {
  searchValue: PropTypes.string.isRequired,
  stateChanged: PropTypes.bool.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default FolderList;
