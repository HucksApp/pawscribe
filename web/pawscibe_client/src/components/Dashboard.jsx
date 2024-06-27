import React, { useState } from 'react';
import Appbar from './Appbar';
import FileList from './FileList';
import TextList from './TextList';
import Footer from './Footer';
import '../css/dashboard.css';

const Dashboard = ({
  stateChanged,
  setStateChange,
  texts,
  setTexts,
  files,
  setFiles,
}) => {
  const [searchValue, setSearchValue] = useState('');
  if (!files) return;
  return (
    <div className="dashboard">
      <Appbar setSearchValue={setSearchValue} />
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

export default Dashboard;
