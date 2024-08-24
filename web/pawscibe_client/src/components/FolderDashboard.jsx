import React, { useState } from 'react';
import Appbar from './Appbar';
import FolderList from './FolderList';
import PropTypes from 'prop-types';
import Footer from './Footer';
import '../css/folder.css';

const Dashboard = ({ stateChanged, setStateChange }) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="dashboard folderdashboard">
      <Appbar setSearchValue={setSearchValue} />
      <FolderList
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
