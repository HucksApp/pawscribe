import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  CardContent,
  Typography /*IconButton*/,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const OpenFolderList = ({ /*folder,*/ files, subfolders }) => {
  const navigate = useNavigate();

  const handleOpenFolder = subfolder => {
    navigate(`/openFolder?folderId=${subfolder.id}`);
  };

  return (
    <Grid container spacing={2}>
      {subfolders.map(subfolder => (
        <Grid item xs={3} key={subfolder.id}>
          <Card onClick={() => handleOpenFolder(subfolder)}>
            <CardContent>
              <FolderIcon style={{ fontSize: 50 }} />
              <Typography variant="h6">{subfolder.foldername}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {files.map(file => (
        <Grid item xs={3} key={file.id}>
          <Card>
            <CardContent>
              <InsertDriveFileIcon style={{ fontSize: 50 }} />
              <Typography variant="h6">{file.filename}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

OpenFolderList.propTypes = {
  folder: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired,
  subfolders: PropTypes.array.isRequired,
};

export default OpenFolderList;
