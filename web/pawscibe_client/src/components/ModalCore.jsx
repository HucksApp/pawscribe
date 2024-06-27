import React from 'react';
import { Modal } from '@mui/material';
import ToFileView from './ToFileView';
import KeyView from './Keyview';

const ModalCore = ({
  view_type,
  open,
  handleClose,
  value,
  setValue,
  handleClick,
  file,
}) => {
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
          file={file}
        />
      </Modal>
    </div>
  );
};

export default ModalCore;
