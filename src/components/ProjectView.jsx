import React, { useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';
import { Notify } from '../utils/Notification';
import '../css/folderview.css';

const ProjectView = ({ project, setStateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  console.log(project);
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const navigate = useNavigate();

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${base}/Api/v1/folders/${project.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Notify({ message: response.data.message, type: 'success' });
      setStateChange(true);
    } catch (error) {
      if (
        error.response.data.msg &&
        error.response.data.msg === 'Token has expired'
      )
        navigate('/');
      else
        Notify({
          message: `${error.message}. ${error.response.data.message}`,
          type: 'error',
        });
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    // Edit logic here
    handleMenuClose();
  };

  const handleOpen = () => {
    const params = { id: project.id };
    navigate(`/viewfolder?${createSearchParams(params)}`);
    handleMenuClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.9 }}
    >
      <div title={project.foldername} className="card">
        <FolderOpenIcon
          sx={{
            fontSize: 100,
            color: '#616161',
            fontWeight: 1000,
            alignSelf: 'center',
          }}
        />
        <CardContent>
          <div className="foldername">
            {' '}
            <div className="foldertitle foldname">
              {project.foldername}
            </div>{' '}
          </div>
          <div className="foldername">
            {' '}
            <div className="foldertitle">Created:</div>{' '}
            <div className="foldervalue">{project.created_at}</div>
          </div>
          <div className="foldername">
            {' '}
            <div className="foldertitle">Last updated:</div>{' '}
            <div className="foldervalue">{project.updated_at}</div>
          </div>
          <div className="foldername">
            {' '}
            <div className="foldertitle">Description</div>{' '}
            <div className="foldervalue">{project.description}</div>
          </div>
          <div className="foldername">
            {' '}
            <div className="foldertitle">language</div>{' '}
            <div className="foldervalue">{project.language}</div>
          </div>
        </CardContent>
        <CardActions>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon color="primary" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>
              <EditIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Edit</div>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <DeleteIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Delete</div>
            </MenuItem>
            <MenuItem onClick={handleOpen}>
              <InfoIcon
                sx={{ fontSize: 25, color: '#616161', paddingRight: 1 }}
              />
              <div className="menuitem">Project Details</div>
            </MenuItem>
          </Menu>
        </CardActions>
      </div>
    </motion.div>
  );
};

ProjectView.propTypes = {
  project: PropTypes.object.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default ProjectView;
