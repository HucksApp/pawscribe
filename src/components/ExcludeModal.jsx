import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Box } from '@mui/material';
import FolderExclude from './FolderExclude';
import FileExclude from './FileExclude';
import TextExclude from './TextExclude';

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

const ExcludeModal = ({
  open,
  handleClose,
  excludeType,
  folderId,
  onSelect,
}) => {
  const renderContent = () => {
    switch (excludeType) {
      case 'Folder':
        return <FolderExclude folderId={folderId} onSelect={onSelect} />;
      case 'File':
        return <FileExclude folderId={folderId} onSelect={onSelect} />;
      case 'Text':
        return <TextExclude folderId={folderId} onSelect={onSelect} />;
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

ExcludeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  excludeType: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  folderId: PropTypes.number.isRequired,
};

export default ExcludeModal;
