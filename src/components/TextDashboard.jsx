import React, { useState } from 'react';
import Appbar from './Appbar';
import TextList from './TextList';
import Footer from './Footer';
import PropTypes from 'prop-types';

const Dashboard = ({ stateChanged, setStateChange, loaded, setLoaded }) => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <div className="dashboard textdashboard">
      <Appbar setSearchValue={setSearchValue} />
      <TextList
        searchValue={searchValue}
        setStateChange={setStateChange}
        stateChanged={stateChanged}
        setLoaded={setLoaded}
        loaded={loaded}
      />
      <Footer />
    </div>
  );
};

Dashboard.propTypes = {
  stateChanged: PropTypes.bool.isRequired,
  setStateChange: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  setLoaded: PropTypes.func.isRequired,
};

export default Dashboard;
