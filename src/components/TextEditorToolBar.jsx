import React, { useState } from 'react';
import {
  AppBar,
  MenuItem,
  Select,
  Toolbar as MUIToolbar,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import {
  Save,
  Sync,
  Public,
  Lock,
  Chat,
  PlayArrow,
  Groups2,
  Folder,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import MenuDrawer from './MenuDrawer';
import PropTypes from 'prop-types';
/*import { styled } from '@mui/material/styles';

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));*/

const EditorToolbar = ({
  onThemeChange,
  onLanguageChange,
  onFontWeightChange,
  onFontSizeChange,
  onFontFamilyChange,
  onSaveToBackend /* save to script if its just a new file script or save project folder <include> update for the fxs */,
  onSaveToFile,
  onCollaborate,
  onTogglePublic,
  runCode,
  toggleChat,
  toggleDrawer,
  folderId,
}) => {
  const [theme, setTheme] = useState('vs-dark');
  const [language, setLanguage] = useState('plaintext');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Courier New');
  const [isPublic, setIsPublic] = useState(false);
  //const [drawerOpen, setDrawerOpen] = useState(false);
  console.log(folderId, '++++++folder Id');
  const handleThemeChange = event => {
    setTheme(event.target.value);
    onThemeChange(event.target.value);
  };

  const handleLanguageChange = event => {
    setLanguage(event.target.value);
    onLanguageChange(event.target.value);
  };

  const handleFontWeightChange = event => {
    setFontWeight(event.target.value);
    onFontWeightChange(event.target.value);
  };

  const handleFontSizeChange = event => {
    setFontSize(event.target.value);
    onFontSizeChange(event.target.value);
  };

  const handleFontFamilyChange = event => {
    setFontFamily(event.target.value);
    onFontFamilyChange(event.target.value);
  };

  const handleTogglePublic = () => {
    setIsPublic(!isPublic);
    onTogglePublic(!isPublic);
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#616161',
          color: '#fff',
          fontFamily: 'Raleway',
          fontWeight: 1000,
        }}
      >
        <MUIToolbar
          sx={{
            '@media only screen (min-width: 600px)': {
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <MenuDrawer />

          {folderId && (
            <Tooltip
              title="Project Folder"
              sx={{ marginRight: 0.5, marginLeft: 0.5 }}
            >
              <IconButton color="inherit" onClick={toggleDrawer}>
                <Folder />
              </IconButton>
            </Tooltip>
          )}

          <FormControl
            variant="outlined"
            size="small"
            sx={{ marginRight: 1, marginLeft: 1 }}
          >
            <InputLabel
              sx={{ color: '#fff', fontFamily: 'Raleway', fontWeight: 1000 }}
            >
              Theme
            </InputLabel>
            <Select
              sx={{
                color: '#fff',
                fontFamily: 'Raleway',
                fontWeight: 1000,
                border: 0,
              }}
              value={theme}
              onChange={handleThemeChange}
              label="Theme"
            >
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="vs-dark"
              >
                Dark
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="vs-light"
              >
                Light
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ marginRight: 1, marginLeft: 1 }}>
            <InputLabel
              sx={{ color: '#fff', fontFamily: 'Raleway', fontWeight: 500 }}
            >
              Language
            </InputLabel>
            <Select
              value={language}
              onChange={handleLanguageChange}
              label="Language"
              sx={{ color: '#fff', fontFamily: 'Raleway', fontWeight: 500 }}
            >
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="plaintext"
              >
                Plain Text
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="javascript"
              >
                JavaScript
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="python"
              >
                Python
              </MenuItem>

              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="java"
              >
                Java
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="ruby"
              >
                Ruby
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="php"
              >
                PHP
              </MenuItem>

              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="c"
              >
                C
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="cpp"
              >
                C++
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="typescript"
              >
                Typescript
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="jsx"
              >
                React Jsx
              </MenuItem>

              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="css"
              >
                CSS
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="html"
              >
                HTML
              </MenuItem>
              {/* Add more languages as needed */}
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            size="small"
            label="Font Size"
            type="number"
            value={fontSize}
            onChange={handleFontSizeChange}
            sx={{
              color: '#fff',
              fontFamily: 'Raleway',
              fontWeight: 1000,
              marginRight: 1,
              marginLeft: 1,
            }}
          />
          <FormControl
            variant="outlined"
            size="small"
            sx={{ fontSize, marginRight: 1, marginLeft: 1 }}
          >
            <InputLabel
              sx={{ color: '#fff', fontFamily: 'Raleway', fontWeight: 1000 }}
            >
              Font Weight
            </InputLabel>
            <Select
              value={fontWeight}
              onChange={handleFontWeightChange}
              label="Font Weight"
              sx={{ color: '#fff', fontFamily: 'Raleway', fontWeight: 1000 }}
            >
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="normal"
              >
                Normal
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="bold"
              >
                Bold
              </MenuItem>
              <MenuItem
                sx={{
                  color: '#616161',
                  fontFamily: 'Raleway',
                  fontWeight: 1000,
                }}
                value="1000"
              >
                Bolder
              </MenuItem>
            </Select>
          </FormControl>

          <Select
            value={fontFamily}
            onChange={handleFontFamilyChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{
              color: '#fff',
              fontFamily: 'Raleway',
              fontWeight: 1000,
              marginRight: 1,
              marginLeft: 1,
            }}
          >
            <MenuItem value="Courier New" sx={{ fontFamily: 'Courier New' }}>
              Courier New
            </MenuItem>
            <MenuItem
              value="Arial"
              sx={{ fontFamily: 'Arial', fontWeight: 1000 }}
            >
              Arial
            </MenuItem>
            <MenuItem
              value="Times New Roman"
              sx={{ fontFamily: 'Times New Roman', fontWeight: 1000 }}
            >
              Times New Roman
            </MenuItem>

            <MenuItem
              value="Raleway"
              sx={{ fontFamily: 'Raleway', fontWeight: 1000 }}
            >
              Raleway
            </MenuItem>

            <MenuItem
              value="Sevillana"
              sx={{ fontFamily: 'Sevillana', fontWeight: 1000 }}
            >
              Sevillana
            </MenuItem>

            <MenuItem
              value="Pacifico"
              sx={{ fontFamily: 'Pacifico', fontWeight: 1000 }}
            >
              Pacifico
            </MenuItem>

            <MenuItem
              value="Roboto"
              sx={{ fontFamily: 'Roboto', fontWeight: 1000 }}
            >
              Roboto
            </MenuItem>
          </Select>

          <Tooltip title="Save" sx={{ marginRight: 1, marginLeft: 1 }}>
            <IconButton color="inherit" onClick={onSaveToFile}>
              <Sync />
            </IconButton>
          </Tooltip>

          <Tooltip
            title="Save As Script"
            sx={{ marginRight: 1, marginLeft: 1 }}
          >
            <IconButton color="inherit" onClick={onSaveToBackend}>
              <Save />
            </IconButton>
          </Tooltip>

          <Tooltip title="Chat" sx={{ marginRight: 1, marginLeft: 1 }}>
            <IconButton color="inherit" onClick={toggleChat}>
              <Chat />
            </IconButton>
          </Tooltip>

          <Tooltip title="Collaborate" sx={{ marginRight: 1, marginLeft: 1 }}>
            <IconButton color="inherit" onClick={onCollaborate}>
              <Groups2 />
            </IconButton>
          </Tooltip>

          <Tooltip
            title="Script Privacy"
            sx={{ marginRight: 1, marginLeft: 1 }}
          >
            <IconButton color="inherit" onClick={handleTogglePublic}>
              {isPublic ? <Lock /> : <Public />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Run Code" sx={{ marginRight: 1, marginLeft: 1 }}>
            <IconButton color="inherit" onClick={runCode}>
              <PlayArrow />
            </IconButton>
          </Tooltip>
        </MUIToolbar>
      </AppBar>
    </motion.div>
  );
};

EditorToolbar.propTypes = {
  onThemeChange: PropTypes.func.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  onFontWeightChange: PropTypes.func.isRequired,
  onFontSizeChange: PropTypes.func.isRequired,
  onFontFamilyChange: PropTypes.func.isRequired,
  onSaveToBackend: PropTypes.func.isRequired,
  onSaveToFile: PropTypes.func.isRequired,
  onCollaborate: PropTypes.func.isRequired,
  onTogglePublic: PropTypes.func.isRequired,
  runCode: PropTypes.func.isRequired,
  toggleChat: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  folderId: PropTypes.string.isRequired,
};

export default EditorToolbar;
