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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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
        params: {
          page: page,
          per_page: 5,
        },
      });

      const { folders, total, pages } = response.data;
      setTotal(total);
      dispatch(
        setFolders(
          [...folders].sort((a, b) => a.foldername.localeCompare(b.foldername))
        )
      );
      setFilteredFolders(
        [...folders].sort((a, b) => a.foldername.localeCompare(b.foldername))
      );
      setTotalPages(pages);
      //setStateChange(true);
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

  const handleNext = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrev = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    fetchFolders(page); // Fetch folders on component mount
  }, [page]); // Trigger fetch when page changes

  useEffect(() => {
    if (stateChanged) {
      fetchFolders(page);
      setStateChange(false); // Reset the stateChanged after fetching
    }
  }, [stateChanged, page]);

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
  if (Array.isArray(folders) && folders.length === 0 && pathname !== '/folders')
    return;
  if (Array.isArray(folders) && folders.length === 0 && pathname === '/folders')
    return (
      <Container>
        <AddFolder setStateChange={setStateChange} />
        <NoContent msg="No Folder is Present" />
      </Container>
    );

  return (
    <div className="folderlistcontainer">
      <Container sx={{ overflow: 'scroll' }}>
        {folders && (
          <FolderStats
            type="FOLDERS"
            folders={filteredFolders}
            handleNext={handleNext}
            handlePrev={handlePrev}
            page={page}
            total={total}
            totalPages={totalPages}
          />
        )}
        <Grid container spacing={3}>
          <AnimatePresence>
            <AddFolder setStateChange={setStateChange} />
            {Array.isArray(filteredFolders) &&
              filteredFolders.length > 0 &&
              filteredFolders.map(folder => (
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
