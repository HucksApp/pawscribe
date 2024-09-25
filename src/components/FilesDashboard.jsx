import React, { useState, useEffect } from 'react';
import Appbar from './Appbar';
import FileList from './FileList';
import Footer from './Footer';
import PropTypes from 'prop-types';

const Dashboard = ({ stateChanged, setStateChange, loaded, setLoaded }) => {
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    console.log(stateChanged);
  }, [searchValue, stateChanged]);

  return (
    <div className="dashboard filedashboard">
      <Appbar setSearchValue={setSearchValue} />
      <FileList
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
