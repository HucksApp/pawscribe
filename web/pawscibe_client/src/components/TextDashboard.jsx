import React, { useState } from 'react';
import Appbar from './Appbar';
import TextList from './TextList';
import Footer from './Footer';
import PropTypes from 'prop-types';

const Dashboard = ({ stateChanged, setStateChange }) => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <div className="dashboard textdashboard">
      <Appbar setSearchValue={setSearchValue} />
      <TextList
        searchValue={searchValue}
        setStateChange={setStateChange}
        stateChanged={stateChanged}
      />
      <Footer />
    </div>
  );
};

Dashboard.propTypes = {
  stateChanged: PropTypes.bool.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default Dashboard;
