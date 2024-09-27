import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import TextView from './TextView';
import TextStats from './TextStat';
import AddText from './AddText';
import { Notify } from '../utils/Notification';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import NoContent from './NoContent';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTexts } from '../store/textSlice';
import SkeletonLoading from './Skeleton';
import { clearUser } from '../store/userSlice';

const TextList = ({ searchValue, stateChanged, setStateChange }) => {
  const [filteredTexts, setFilteredTexts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [publicCount, setPublicCount] = useState(0);
  const [privateCount, setPrivateCount] = useState(0);

  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');

  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const texts = useSelector(state => state.texts);
  const dispatch = useDispatch();

  if (!token) navigate('/');
  const fetchTexts = async () => {
    try {
      const response = await axios.get(base + '/Api/v1/text/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page, // Current page
          per_page: 5, // texts per page
        },
      });

      const { texts, publicCount, privateCount, total, pages } = response.data;
      console.log(response.data, '======= TEXT>>>>>>');
      dispatch(setTexts([...texts]));
      setFilteredTexts([...texts]);
      setTotalPages(pages);
      setTotal(total);
      setPrivateCount(privateCount);
      setPublicCount(publicCount);
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

  useEffect(() => {
    fetchTexts(page); // Fetch texts on component mount
  }, [page]);

  useEffect(() => {
    if (stateChanged) {
      fetchTexts(page);
      setStateChange(false);
    }
  }, [stateChanged, page]);
  useEffect(() => {
    if (searchValue) {
      //setSearchTerm(searchValue);
      setFilteredTexts(
        texts.filter(text => text.content.toLowerCase().includes(searchValue))
      );
    } else {
      setFilteredTexts(texts);
    }
  }, [searchValue]);

  if (!texts) return <SkeletonLoading />;
  if (
    texts &&
    Array.isArray(texts) &&
    texts.length === 0 &&
    pathname !== '/texts'
  )
    return;
  if (
    texts &&
    Array.isArray(texts) &&
    texts.length === 0 &&
    pathname === '/texts'
  )
    return (
      <Container>
        <AddText />
        <NoContent msg="No Script is Present" />
      </Container>
    );
  return (
    <div className="listcontainer">
      <Container sx={{ overflow: 'scroll' }}>
        {texts && (
          <TextStats
            texts={filteredTexts}
            handleNext={handleNext}
            handlePrev={handlePrev}
            page={page}
            total={total}
            privateCount={privateCount}
            publicCount={publicCount}
            totalPages={totalPages}
          />
        )}
        <Grid container spacing={5}>
          <AnimatePresence>
            <AddText />
            {Array.isArray(filteredTexts) &&
              filteredTexts.length > 0 &&
              filteredTexts.map(text => (
                <Grid item key={text.id} xs={6} sm={3} md={2} lg={2} xl={2}>
                  <TextView
                    text={text}
                    stateChanged={stateChanged}
                    setStateChange={setStateChange}
                  />
                </Grid>
              ))}
          </AnimatePresence>
        </Grid>
      </Container>
    </div>
  );
};

TextList.propTypes = {
  searchValue: PropTypes.string.isRequired,
  stateChanged: PropTypes.bool.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default TextList;
