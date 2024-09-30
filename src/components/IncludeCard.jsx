import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  //IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import getFileContent from '../utils/projectBlob';
import { addFileBlob } from '../store/fileBlobSlice';

const IncludeCard = ({ file, icon, onSelect }) => {
  let blob = useSelector(state =>
    state.fileBlobs.find(blob => blob.id === file.id.toString())
  );
  const [fileBlob, setFileBlob] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (blob) setFileBlob(blob.blob);
    else {
      console.log('====', file);
      const { fetchBlobContent, loading } = getFileContent(
        file.fx && file.fx.file_id ? file.fx.file_id : file.id
      );
      if (!loading) {
        blob = fetchBlobContent((blob = true));
        setFileBlob(blob);
        dispatch(addFileBlob({ id: file.id.toString(), blob }));
      }
    }
  }, []);

  return (
    <div>
      <Card
        sx={{
          display: 'flex',
          //border: 'solid red',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover': {
            opacity: 0.9,
            cursor: 'pointer',
          },
        }}
        onClick={() => onSelect({ ...file, fileBlob })}
      >
        <CardContent>
          <div className="includecardImg">{icon(file)}</div>
          <Typography
            sx={{
              fontSize: 15,
              color: '#616161',
              fontFamily: 'Raleway',
              fontWeight: 1000,
            }}
            variant="h6"
          >
            {file.filename}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

IncludeCard.propTypes = {
  file: PropTypes.object.isRequired,
  icon: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default IncludeCard;
