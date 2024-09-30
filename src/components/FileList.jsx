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
  const files = useSelector(state => state.files); // files from Redux state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [publicCount, setPublicCount] = useState(0);
  const [privateCount, setPrivateCount] = useState(0);

  if (!token) navigate('/');

  const fetchFiles = async (page = 1) => {
    try {
      const response = await axios.get(base + '/Api/v1/files/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page, // Current page
          per_page: 5, // Files per page (adjust as needed)
        },
      });

      const { files, publicCount, privateCount, total, pages } = response.data;
      dispatch(
        setFiles(
          [...files].sort((a, b) => a.filename.localeCompare(b.filename))
        )
      );
      setFilteredFiles(
        [...files].sort((a, b) => a.filename.localeCompare(b.filename))
      );

      setTotal(total);
      setPublicCount(publicCount);
      setPrivateCount(privateCount);
      setTotalPages(pages);
    } catch (error) {
      if (error.response)
        if (
          error.response.data.msg &&
          error.response.data.msg === 'Token has expired'
        ) {
          localStorage.removeItem('jwt_token');
          dispatch(clearUser());
          navigate('/');
          return;
        } else if (error.message == 'Request failed with status code 401') {
          localStorage.removeItem('jwt_token');
          dispatch(clearUser());
          navigate('/');
          return;
        } else {
          Notify({
            message: `${error.message}. ${error.response.data.message} `,
            type: 'error',
          });
          return;
        }
      else {
        Notify({
          message: `${error.message}`,
          type: 'error',
        });
        return;
      }
    }
  };

  const handleNext = () => {
    setPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrev = () => {
    setPage(prev => Math.max(prev - 1, 1));
  };

  // Effect to run when stateChanged or page changes
  useEffect(() => {
    if (stateChanged) {
      fetchFiles(page);
      setStateChange(false); // Reset the stateChanged after fetching
    }
  }, [stateChanged, page]);

  // Run fetchFiles once on component mount
  useEffect(() => {
    fetchFiles(page); // Fetch files for the first time
  }, [page]);

  // Search logic when searchValue is updated
  useEffect(() => {
    if (searchValue) {
      setFilteredFiles(
        [...files]
          .filter(file => file.filename.toLowerCase().includes(searchValue))
          .sort((a, b) => a.filename.localeCompare(b.filename))
      );
    } else {
      setFilteredFiles(files);
    }
  }, [searchValue, files]);

  // **Loading State: Show Skeleton when files is null (still loading)**
  if (!files) return <SkeletonLoading />;

  // **No Content State: Show NoContent when files is an empty array**
  if (Array.isArray(files) && files.length === 0 && pathname !== '/files')
    return;
  if (Array.isArray(files) && files.length === 0 && pathname === '/files') {
    return (
      <Container>
        <AddFile setStateChange={setStateChange} />
        <NoContent msg="No File is Present" />
      </Container>
    );
  }

  return (
    <div className="listcontainer">
      <Container sx={{ overflow: 'scroll' }}>
        {files && (
          <FileStats
            files={filteredFiles}
            handleNext={handleNext}
            handlePrev={handlePrev}
            page={page}
            total={total}
            privateCount={privateCount}
            publicCount={publicCount}
            totalPages={totalPages}
          />
        )}
        <Grid container spacing={3}>
          <AddFile setStateChange={setStateChange} />
          <AnimatePresence>
            {Array.isArray(filteredFiles) &&
              filteredFiles.length > 0 &&
              filteredFiles.map(file => (
                <Grid item key={file.id} xs={6} sm={3} md={2} lg={2} xl={2}>
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
