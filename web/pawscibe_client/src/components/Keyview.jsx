import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Notify } from '../utils/Notification';
import '../css/keyView.css';
import PropTypes from 'prop-types';

const Keyview = ({ value, handleClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `key=${value.shared_with_key}&id=${value.id}`
    );
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
      >{`key=${value.shared_with_key}&id=${value.id}`}</div>
    </div>
  );
};

Keyview.propTypes = {
  value: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default Keyview;
