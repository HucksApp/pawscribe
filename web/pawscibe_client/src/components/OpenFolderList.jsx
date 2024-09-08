import React from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import File from './File';
import Folder from './Folder';
import Text from './Text';

const OpenFolderList = ({
  setStateChange,
  stateChanged,
  searchValue,
  files,
  texts,
  subfolders,
}) => {
  const navigate = useNavigate();
  console.log(searchValue, stateChanged);

  const handleOpenFile = file => {
    const url = URL.createObjectURL(file.blob);
    const params = { id: file.id, src: url };
    navigate(`/viewfile?${createSearchParams(params)}`);
  };

  return (
    <Grid container spacing={3}>
      {' '}
      {/* Add spacing between grid items */}
      {subfolders &&
        subfolders.map(subfolder => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={subfolder.id}>
            {/* Responsive grid layout for folders */}
            <Folder folder={subfolder} setStateChange={setStateChange} />
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
            />
          </Grid>
        ))}
      {texts &&
        texts.map(text => (
          <Grid itemitem xs={6} sm={4} md={3} lg={2} key={text.id}>
            {/* Responsive grid layout for texts */}
            <Text text={text} setStateChange={setStateChange} />
          </Grid>
        ))}
    </Grid>
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
