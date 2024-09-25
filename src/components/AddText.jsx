import React, { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { NoteAdd } from '@mui/icons-material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Groups2Icon from '@mui/icons-material/Groups2';
import '../css/add.css';

import { useNavigate } from 'react-router-dom';

const AddText = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  /*
  const handleDelete = async () => {
    //add needed
    handleMenuClose();
    // Refresh the file list here if needed
  };
*/
  const handleEdit = () => {
    // Edit logic here
    handleMenuClose();
  };

  /*const handleShare = () => {
    // Share logic here
    handleMenuClose();
  };*/

  return (
    <div className="add">
      <IconButton onClick={handleMenuOpen}>
        <NoteAdd color="secondary" fontSize="large" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Groups2Icon color="secondary" />
          <div className="menuitem"> New Collaboration</div>
        </MenuItem>
        <MenuItem onClick={() => navigate('/editor')}>
          <BorderColorIcon color="secondary" />
          <div className="menuitem">Code Editor</div>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AddText;
