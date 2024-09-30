import React, { useState, useEffect } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import File from './File';
import Folder from './Folder';
import Text from './Text';
import NoContent from './NoContent';
//import axios from 'axios';
//import { useDispatch } from 'react-redux';
// import { addFileBlob } from '../store/fileBlobSlice';
//import { Notify } from '../utils/Notification';

const OpenFolderList = ({
  setStateChange,
  stateChanged,
  searchValue,
  files,
  texts,
  subfolders,
}) => {
  //const dispatch = useDispatch();
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [filteredTexts, setFilteredTexts] = useState([]);
  const [filteredSubfolders, setFilteredSubfolders] = useState([]);

  // Search logic when searchValue is updated
  useEffect(() => {
    if (searchValue) {
      setFilteredFiles(
        [...files]
          .filter(file => file.filename.toLowerCase().includes(searchValue))
          .sort((a, b) => a.filename.localeCompare(b.filename))
      );
      setFilteredTexts(
        texts.filter(text => text.content.toLowerCase().includes(searchValue))
      );

      setFilteredSubfolders(
        [...subfolders]
          .filter(folder =>
            folder.foldername.toLowerCase().includes(searchValue.toLowerCase())
          )
          .sort((a, b) => a.foldername.localeCompare(b.foldername))
      );
    } else {
      setFilteredFiles(files);
      setFilteredTexts(texts);
      setFilteredSubfolders(subfolders);
    }
  }, [searchValue, texts, files, subfolders]);

  const navigate = useNavigate();

  const handleOpenScript = async text => {
    const params = { id: text.id, type: 'Text' };
    navigate(`/viewfile?${createSearchParams(params)}`);
  };

  const handleOpenFile = async file => {
    let url;
    if (file && file.blob && Object.keys(file.blob).length > 0) {
      url = URL.createObjectURL(file.blob);
    }

    // Create the params object with conditional inclusion of 'src'
    const params = { id: file.id, type: 'File' };

    if (url) {
      params.src = url; // Only include 'src' if the URL is available
    }

    navigate(`/viewfile?${createSearchParams(params)}`);
  };

  const isEmptyContent = [files, texts, subfolders].every(
    list => Array.isArray(list) && list.length === 0
  );
  console.log(files, texts, subfolders, isEmptyContent);

  return (
    <div className="openfolderlistcontainer">
      <Grid container spacing={5}>
        {' '}
        {/* Add spacing between grid items */}
        {filteredSubfolders &&
          filteredSubfolders.map(subfolder => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={subfolder.id}>
              {/* Responsive grid layout for folders */}
              <Folder
                folder={subfolder}
                setStateChange={setStateChange}
                stateChanged={stateChanged}
              />
            </Grid>
          ))}
        {filteredFiles &&
          filteredFiles.map(file => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={file.id}>
              {/* Responsive grid layout for files */}
              <File
                file={file}
                handleOpenFile={handleOpenFile}
                setStateChange={setStateChange}
                stateChanged={stateChanged}
              />
            </Grid>
          ))}
        {filteredTexts &&
          filteredTexts.map(text => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={text.id}>
              {/* Responsive grid layout for texts */}
              <Text
                text={text}
                handleOpenScript={handleOpenScript}
                setStateChange={setStateChange}
                stateChanged={stateChanged}
              />
            </Grid>
          ))}
      </Grid>
      {isEmptyContent ? <NoContent msg={'Empty Folder'} /> : <p></p>}
    </div>
  );
};

OpenFolderList.propTypes = {
  setStateChange: PropTypes.func.isRequired,
  stateChanged: PropTypes.bool.isRequired,
  files: PropTypes.array.isRequired,
  texts: PropTypes.array.isRequired,
  searchValue: PropTypes.string.isRequired,
  subfolders: PropTypes.array.isRequired,
};

export default OpenFolderList;
