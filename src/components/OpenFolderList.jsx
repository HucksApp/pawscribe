import React, { useEffect } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import File from './File';
import Folder from './Folder';
import Text from './Text';
import NoContent from './NoContent';

const OpenFolderList = ({
  setStateChange,
  stateChanged,
  searchValue,
  files,
  texts,
  subfolders,
}) => {
  useEffect(() => {}, [texts, files, subfolders]);
  const navigate = useNavigate();
  console.log(searchValue, stateChanged, '--------');

  const handleOpenFile = file => {
    const url = URL.createObjectURL(file.blob);
    const params = { id: file.id, src: url };
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
        {subfolders &&
          subfolders.map(subfolder => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={subfolder.id}>
              {/* Responsive grid layout for folders */}
              <Folder
                folder={subfolder}
                setStateChange={setStateChange}
                stateChanged={stateChanged}
              />
            </Grid>
          ))}
        {files &&
          files.map(file => (
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
        {texts &&
          texts.map(text => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={text.id}>
              {/* Responsive grid layout for texts */}
              <Text
                text={text}
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
