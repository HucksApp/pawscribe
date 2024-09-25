import React from 'react';
import { motion } from 'framer-motion';
import FolderIcon from '@mui/icons-material/Folder';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PropTypes from 'prop-types';

const FolderStats = ({
  type,
  handleNext,
  handlePrev,
  page,
  totalPages,
  total,
}) => {
  //{php:"#87CEFA",pdf:"#A9A9A9",js:"#FFFF00",html:"#FF0000",sh:"#ff4500",css:"#0000FF",py:"#2b35af"}
  //const totalFolders = folders.length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.9 }}
    >
      <div className="statcontainer">
        <div className="filestat">
          <div className="head">
            <div className="total">
              <span className="icon">
                <FolderIcon color="action" fontSize="large" />
              </span>
              <span className="span1">ALL {type}</span>
              <span className="span2">{total}</span>
            </div>
          </div>
        </div>

        <div className="pagenav">
          <Tooltip title="Previous" sx={{ marginRight: 0.5, marginLeft: 0.5 }}>
            <IconButton onClick={handlePrev} disabled={page === 1}>
              <SkipPreviousIcon sx={{ fontSize: 50, color: '#fcfcfc' }} />
            </IconButton>
          </Tooltip>

          <div className="pagenavstat">
            Page {page} of {totalPages}
          </div>
          <Tooltip title="Next" sx={{ marginRight: 0.5, marginLeft: 0.5 }}>
            <IconButton onClick={handleNext} disabled={page === totalPages}>
              <SkipNextIcon sx={{ fontSize: 50, color: '#fcfcfc' }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
};

FolderStats.propTypes = {
  folders: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default FolderStats;
