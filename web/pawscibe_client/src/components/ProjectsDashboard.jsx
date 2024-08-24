import React, { useState } from 'react';
import '../css/folder.css';
import Appbar from './Appbar';
import ProjectList from './ProjectList';
import PropTypes from 'prop-types';
import Footer from './Footer';

const Dashboard = ({ stateChanged, setStateChange }) => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <div className="dashboard folderdashboard">
      <Appbar setSearchValue={setSearchValue} />
      <ProjectList
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
