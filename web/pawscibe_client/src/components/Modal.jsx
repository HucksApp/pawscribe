import React from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Modal from '@mui/material/Modal';

const Modal_struct = props => {
  let Logon_view = '';

  if (props.logon_type === 'login') Logon_view = Login;
  else if (props.logon_type === 'signup') {
    Logon_view = Signup;
  }
  return (
    <div className="modal">
      <Modal open={props.open} onClose={props.handleClose}>
        <Logon_view />
      </Modal>
    </div>
  );
};

export default Modal_struct;
