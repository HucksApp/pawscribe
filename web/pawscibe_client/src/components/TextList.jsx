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
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const texts = useSelector(state => state.texts);
  const dispatch = useDispatch();

  if (!token) navigate('/');
  const fetchFiles = async () => {
    try {
      const response = await axios.get(base + '/Api/v1/text/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setTexts(response.data));
      setFilteredTexts(response.data);
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
      setFilteredTexts(
        texts.filter(text => text.content.toLowerCase().includes(searchValue))
      );
    } else {
      setFilteredTexts(texts);
    }
  }, [searchValue]);

  if (!texts) return <SkeletonLoading />;
  else if (
    texts &&
    Array.isArray(texts) &&
    texts.length < 1 &&
    pathname == '/texts'
  )
    return (
      <Container>
        <AddText />
        <NoContent msg="No Script is Present" />
      </Container>
    );
  else if (texts && Array.isArray(texts) && texts.length < 1) return;
  return (
    <div className="listcontainer">
      <Container sx={{ overflow: 'scroll' }}>
        {texts && <TextStats texts={filteredTexts} />}
        <Grid container spacing={3}>
          <AnimatePresence>
            <AddText />
            {filteredTexts.map(text => (
              <Grid item key={text.id} xs={8} sm={4} md={2}>
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
