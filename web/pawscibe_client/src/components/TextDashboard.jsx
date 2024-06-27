import React, { useState } from 'react';
import Appbar from './Appbar';
import TextList from './TextList';
import Footer from './Footer';
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

export default Dashboard;
