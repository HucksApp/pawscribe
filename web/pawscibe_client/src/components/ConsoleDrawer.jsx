// src/components/ConsoleDrawer.jsx

import React from 'react';
import { Drawer, IconButton, Tooltip } from '@mui/material';
import { IndeterminateCheckBox } from '@mui/icons-material';
import Console from './Console';

const ConsoleDrawer = ({ open, onClose, code, language }) => {
  return (
    <>
      <Tooltip title="Terminal" sx={{ marginRight: 1, marginLeft: 1 }}>
        <IconButton onClick={onClose}>
          <IndeterminateCheckBox
            sx={{ fontSize: 25, color: '#616161', fontWeight: 1000 }}
          />
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        variant="persistent"
        sx={{
          width: '100%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '100%',
            boxSizing: 'border-box',
          },
        }}
      >
        <Tooltip title="Terminal" sx={{ marginRight: 1, marginLeft: 1 }}>
          <IconButton onClick={onClose}>
            <IndeterminateCheckBox
              sx={{ fontSize: 25, color: '#616161', fontWeight: 1000 }}
            />
          </IconButton>
        </Tooltip>

        <div style={{ height: '30vh', width: '100%', paddingTop: 5 }}>
          <Console code={code} language={language} open={open} />
        </div>
      </Drawer>
    </>
  );
};

export default ConsoleDrawer;
