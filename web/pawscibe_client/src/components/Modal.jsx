import React from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
const Modal_struct = ({ logon_type, open, handleClose }) => {
  let Logon_view = '';

  if (logon_type === 'login') Logon_view = Login;
  else if (logon_type === 'signup') {
    Logon_view = Signup;
  }
  return (
    <div className="modal">
      <Modal open={open} onClose={handleClose}>
        <Logon_view />
      </Modal>
    </div>
  );
};
Modal_struct.propTypes = {
  logon_type: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default Modal_struct;
