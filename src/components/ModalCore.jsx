import React from 'react';
import { Modal } from '@mui/material';
import ToFileView from './ToFileView';
import KeyView from './Keyview';
import PropTypes from 'prop-types';

const ModalCore = ({
  view_type,
  open,
  handleClose,
  value,
  setValue,
  handleClick,
}) => {
  console.log(value);
  let View;
  if (view_type === 'toFile') View = ToFileView;
  else if (view_type === 'keyView') View = KeyView;
  return (
    <div className="modalcore">
      <Modal open={open} onClose={handleClose}>
        <View
          value={value}
          setValue={setValue}
          handleClick={handleClick}
          handleClose={handleClose}
        />
      </Modal>
    </div>
  );
};

ModalCore.propTypes = {
  view_type: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
};
export default ModalCore;
