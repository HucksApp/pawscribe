import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Notify } from '../utils/Notification';
import '../css/keyView.css';
import PropTypes from 'prop-types';

const Keyview = ({ file, handleClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(`key=${file.shared_with_key}&id=${file.id}`);
    Notify({ message: 'key Copied', type: 'info' });
  };
  return (
    <div className="keyview">
      <div className="close">
        <CloseIcon
          sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
          onClick={handleClose}
        />
      </div>
      <div className="title">PRIVATE FILE, SHARE KEY FOR ACCESS PERMISSION</div>
      <div
        className="key"
        onClick={handleCopy}
      >{`key=${file.shared_with_key}&id=${file.id}`}</div>
    </div>
  );
};

Keyview.propTypes = {
  file: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default Keyview;
