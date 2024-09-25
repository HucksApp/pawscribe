import React from 'react';
//import InventoryIcon from '@mui/icons-material/Inventory';
import { motion } from 'framer-motion';
import '../css/nocontent.css';
import PropTypes from 'prop-types';

const NoContent = ({ msg }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nocontentcont">
        <div className="nocontentmsg">{msg}</div>
      </div>
    </motion.div>
  );
};
NoContent.propTypes = {
  msg: PropTypes.string.isRequired,
};

export default NoContent;
