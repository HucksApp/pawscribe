import React, { useState, useEffect } from 'react';
import Appbar from './Appbar';
import FileList from './FileList';
import TextList from './TextList';
import Footer from './Footer';
import NoContent from './NoContent';
import PropTypes from 'prop-types';
import FolderList from './FolderList';
import { useSelector } from 'react-redux';
import '../css/dashboard.css';

const Dashboard = ({ stateChanged, setStateChange }) => {
  const [searchValue, setSearchValue] = useState('');

  const texts = useSelector(state => state.texts);
  const files = useSelector(state => state.files);
  const folders = useSelector(state => state.folders);
  const projects = useSelector(state => state.projects);

  useEffect(() => {}, [texts, files, folders, projects]);

  const isEmptyContent = [files, texts, folders, projects].every(
    list => Array.isArray(list) && list.length === 0
  );

  return (
    <div className="dashboard">
      <Appbar setSearchValue={setSearchValue} />

      {isEmptyContent ? (
        <NoContent msg={'No Folder, Files, or script present'} />
      ) : (
        <>
          <FileList
            searchValue={searchValue}
            setStateChange={setStateChange}
            stateChanged={stateChanged}
          />
          <TextList
            searchValue={searchValue}
            setStateChange={setStateChange}
            stateChanged={stateChanged}
          />
          <FolderList
            searchValue={searchValue}
            setStateChange={setStateChange}
            stateChanged={stateChanged}
          />
        </>
      )}

      <Footer />
    </div>
  );
};

Dashboard.propTypes = {
  stateChanged: PropTypes.bool.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default Dashboard;
