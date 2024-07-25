import React, { useState } from 'react';
import Appbar from './Appbar';
import FileList from './FileList';
import Footer from './Footer';
import PropTypes from 'prop-types';

const Dashboard = ({ stateChanged, setStateChange, files, setFiles }) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="dashboard filedashboard">
      <Appbar setSearchValue={setSearchValue} />
      <FileList
        searchValue={searchValue}
        setStateChange={setStateChange}
        stateChanged={stateChanged}
        files={files}
        setFiles={setFiles}
      />
      <Footer />
    </div>
  );
};

Dashboard.propTypes = {
  stateChanged: PropTypes.object.isRequired,
  setStateChange: PropTypes.func.isRequired,
  files: PropTypes.object.isRequired,
  setFiles: PropTypes.func.isRequired,
};

export default Dashboard;
