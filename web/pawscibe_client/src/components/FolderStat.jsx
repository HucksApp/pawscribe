import React from 'react';
import { motion } from 'framer-motion';
import FolderIcon from '@mui/icons-material/Folder';

import PropTypes from 'prop-types';

const FolderStats = ({ folders, type }) => {
  //{php:"#87CEFA",pdf:"#A9A9A9",js:"#FFFF00",html:"#FF0000",sh:"#ff4500",css:"#0000FF",py:"#2b35af"}
  console.log(folders);
  const totalFolders = folders.length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.9 }}
    >
      <div className="filestat">
        <div className="head">
          <div className="total">
            <span className="icon">
              <FolderIcon color="action" fontSize="large" />
            </span>
            <span className="span1">ALL {type}</span>
            <span className="span2">{totalFolders}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

FolderStats.propTypes = {
  folders: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

export default FolderStats;
