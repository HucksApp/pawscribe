import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  //IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';

const ExcludeCard = ({ file, icon, onSelect }) => {
  return (
    <div>
      <Card onClick={() => onSelect(file)}>
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

ExcludeCard.propTypes = {
  file: PropTypes.object.isRequired,
  icon: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ExcludeCard;
