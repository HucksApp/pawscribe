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

const TextList = ({
  searchValue,
  stateChanged,
  setStateChange,
  texts,
  setTexts,
}) => {
  const [filteredTexts, setFilteredTexts] = useState([]);
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  if (!token) navigate('/');
  const fetchFiles = async () => {
    try {
      const response = await axios.get(base + '/Api/v1/text/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTexts(response.data);
      setFilteredTexts(response.data);
    } catch (error) {
      Notify({
        message: `${error.message}. ${error.response.data.message}`,
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
  if (!texts.length && pathname == '/texts')
    return (
      <Container>
        <NoContent msg="No Script is Present" />
      </Container>
    );
  else if (!texts.length) return;
  return (
    <Container>
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
  );
};

TextList.propTypes = {
  searchValue: PropTypes.func.isRequired,
  stateChanged: PropTypes.func.isRequired,
  setStateChange: PropTypes.func.isRequired,
  texts: PropTypes.func.isRequired,
  setTexts: PropTypes.func.isRequired,
};

export default TextList;
