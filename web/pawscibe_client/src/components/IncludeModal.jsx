import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Box } from '@mui/material';
import FolderInclude from './FolderInclude';
import FileInclude from './FileInclude';
import TextInclude from './TextInclude';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const IncludeModal = ({
  open,
  handleClose,
  includeType,
  onSelect,
  setModalOpen,
}) => {
  const renderContent = () => {
    switch (includeType) {
      case 'Folder':
        return (
          <FolderInclude setModalOpen={setModalOpen} onSelect={onSelect} />
        );
      case 'File':
        return <FileInclude setModalOpen={setModalOpen} onSelect={onSelect} />;
      case 'Text':
        return <TextInclude setModalOpen={setModalOpen} onSelect={onSelect} />;
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>{renderContent()}</Box>
    </Modal>
  );
};

IncludeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  includeType: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};

export default IncludeModal;
