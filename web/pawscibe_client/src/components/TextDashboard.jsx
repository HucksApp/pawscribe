import React, { useState } from 'react';
import Appbar from './Appbar';
import TextList from './TextList';
import Footer from './Footer';
import PropTypes from 'prop-types';

const Dashboard = ({ texts, setTexts, stateChanged, setStateChange }) => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <div className="dashboard textdashboard">
      <Appbar setSearchValue={setSearchValue} />
      <TextList
        searchValue={searchValue}
        setStateChange={setStateChange}
        stateChanged={stateChanged}
        texts={texts}
        setTexts={setTexts}
      />
      <Footer />
    </div>
  );
};

Dashboard.propTypes = {
  texts: PropTypes.object.isRequired,
  setTexts: PropTypes.func.isRequired,
  stateChanged: PropTypes.object.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default Dashboard;
