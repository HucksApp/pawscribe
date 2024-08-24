import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  //IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectFileBlobById } from '../store/fileBlobSlice';

const IncludeCard = ({ file, icon, onSelect }) => {
  const fileBlob = useSelector(state =>
    selectFileBlobById(state, toString(file.id))
  );
  const blobs = useSelector(state => state.fileBlobs);
  const allb = useSelector(state => state);
  const blob = useSelector(state =>
    state.fileBlobs.find(blob => blob.id === file.id.toString())
  );
  console.log(
    allb,
    '====',
    blobs,
    '=======',
    file.id,
    '=========',
    blob,
    '====',
    fileBlob
  );
  return (
    <div>
      <Card onClick={() => onSelect({ ...file, fileBlob: blob.blob })}>
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
