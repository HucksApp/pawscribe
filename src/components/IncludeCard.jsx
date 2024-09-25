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
      const { fetchBlobContent, loading } = getFileContent(file);
      if (!loading) {
        blob = fetchBlobContent((blob = true));
        setFileBlob(blob);
        dispatch(addFileBlob({ id: file.id.toString(), blob }));
      }
    }
  }, []);

  return (
    <div>
      <Card onClick={() => onSelect({ ...file, fileBlob })}>
        <CardContent>
          {icon(file)}
          <Typography
            sx={{
              fontSize: 25,
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
