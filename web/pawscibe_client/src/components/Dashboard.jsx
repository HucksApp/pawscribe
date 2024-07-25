import React, { useState, useEffect } from 'react';
import Appbar from './Appbar';
import FileList from './FileList';
import TextList from './TextList';
import Footer from './Footer';
import NoContent from './NoContent';
import '../css/dashboard.css';
import PropTypes from 'prop-types';
const Dashboard = ({
  stateChanged,
  setStateChange,
  texts,
  setTexts,
  files,
  setFiles,
}) => {
  useEffect(() => {}, [texts, files]);
  const [searchValue, setSearchValue] = useState('');
  return (
    <div className="dashboard">
      <Appbar setSearchValue={setSearchValue} />
      {(files.length > 0) | (texts.length > 0) ? (
        <p className="hidden"></p>
      ) : (
        <NoContent msg={'No Folder, Files, or script present'} />
      )}

      <FileList
        files={files}
        setFiles={setFiles}
        searchValue={searchValue}
        setStateChange={setStateChange}
        stateChanged={stateChanged}
      />
      <TextList
        texts={texts}
        setTexts={setTexts}
        searchValue={searchValue}
        setStateChange={setStateChange}
        stateChanged={stateChanged}
      />
      <Footer />
    </div>
  );
};

Dashboard.propTypes = {
  stateChanged: PropTypes.object.isRequired,
  setStateChange: PropTypes.func.isRequired,
  texts: PropTypes.object.isRequired,
  setTexts: PropTypes.func.isRequired,
  files: PropTypes.object.isRequired,
  setFiles: PropTypes.func.isRequired,
};

export default Dashboard;
