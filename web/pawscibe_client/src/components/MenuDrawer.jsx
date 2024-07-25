import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import ShieldIcon from '@mui/icons-material/Shield';
import PublicIcon from '@mui/icons-material/Public';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import axios from 'axios';
import { Notify } from '../utils/Notification';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CodeIcon from '@mui/icons-material/Code';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const base = process.env.REACT_APP_BASE_API_URL;

const MenuDrawer = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const toggleDrawer = newOpen => () => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(base + '/Api/v1/logout');
      Notify({ message: response.data.message, type: 'success' });
      localStorage.removeItem('jwt_token');
      navigate('/');
    } catch (error) {
      Notify({ message: error.message, type: 'error' });
    }
  };

  const DrawerList = (
    <Box
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        <ListItem key={'logout'} onClick={handleLogout} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon sx={{ fontSize: 30, color: '#616161' }} />
            </ListItemIcon>
            <div className="itemtext">Logout</div>
          </ListItemButton>
        </ListItem>

        <ListItem
          key={'profile'}
          onClick={() => navigate('/profile')}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <AccountCircleIcon sx={{ fontSize: 30, color: '#616161' }} />
            </ListItemIcon>
            <div className="itemtext">Profile</div>
          </ListItemButton>
        </ListItem>

        <ListItem
          key={'Dashboard'}
          onClick={() => navigate('/dashboard')}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon sx={{ fontSize: 30, color: '#616161' }} />
            </ListItemIcon>
            <div className="itemtext">Dashboard</div>
          </ListItemButton>
        </ListItem>

        <ListItem
          key={'Folder'}
          onClick={() => navigate('/folders')}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <FolderOpenIcon sx={{ fontSize: 30, color: '#616161' }} />
            </ListItemIcon>
            <div className="itemtext">Folders</div>
          </ListItemButton>
        </ListItem>

        <ListItem
          key={'Files'}
          onClick={() => navigate('/files')}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <InsertDriveFileIcon sx={{ fontSize: 30, color: '#616161' }} />
            </ListItemIcon>
            <div className="itemtext">Files</div>
          </ListItemButton>
        </ListItem>

        <ListItem
          key={'Text'}
          onClick={() => navigate('/texts')}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <CodeIcon sx={{ fontSize: 30, color: '#616161' }} />
            </ListItemIcon>
            <div className="itemtext">Scripts</div>
          </ListItemButton>
        </ListItem>

        <ListItem
          key={'Editor'}
          onClick={() => navigate('/editor')}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <ListAltIcon sx={{ fontSize: 30, color: '#616161' }} />
            </ListItemIcon>

            <div className="itemtext">Editor</div>
          </ListItemButton>
        </ListItem>

        <ListItem
          key={'publics'}
          onClick={() => navigate('/publics')}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <PublicIcon sx={{ fontSize: 30, color: '#616161' }} />
            </ListItemIcon>
            <div className="itemtext">Public Shares</div>
          </ListItemButton>
        </ListItem>

        <ListItem
          key={'private'}
          onClick={() => navigate('/private')}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <ShieldIcon sx={{ fontSize: 30, color: '#616161' }} />
            </ListItemIcon>
            <div className="itemtext">Private shared</div>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className="menudrawer">
      <IconButton
        open={open}
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default MenuDrawer;
