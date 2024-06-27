import React from 'react';
import { TextField } from '@mui/material';
import '../css/tofileview.css';
import CloseIcon from '@mui/icons-material/Close';
const ToFileView = ({ value, setValue, handleClick, handleClose }) => {
  return (
    <div className="tofileview">
      <div className="close">
        <CloseIcon
          sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
          onClick={handleClose}
        />
      </div>
      <TextField
        label="FILE NAME"
        value={value}
        onChange={e => setValue(e.target.value)}
        fullWidth
        margin="normal"
      />
      <div className="button">
        <button onClick={handleClick}>SAVE TO FILE</button>
      </div>
    </div>
  );
};

export default ToFileView;
