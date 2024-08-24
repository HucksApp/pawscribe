import React, { forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialog = ({
  title,
  message,
  handleYes,
  handleNo,
  open,
  handleClose,
}) => {
  return (
    <div className="Alert">
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            fontSize: 25,
            color: '#1976d2',
            fontFamily: 'Raleway',
            fontWeight: 1000,
          }}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: 15,
              color: '#616161',
              fontFamily: 'Raleway',
              fontWeight: 1000,
            }}
            id="alert-dialog-slide-description"
          >
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              fontSize: 15,
              fontFamily: 'Raleway',
              color: '#9c27b0',
              fontWeight: 1000,
            }}
            onClick={handleNo}
          >
            No
          </Button>
          <Button
            sx={{
              fontSize: 15,
              fontFamily: 'Raleway',
              color: '#9c27b0',
              fontWeight: 1000,
            }}
            onClick={handleYes}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AlertDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  handleYes: PropTypes.func.isRequired,
  handleNo: PropTypes.func.isRequired,
  open: PropTypes.object.isRequired,
  handleClose: PropTypes.object.isRequired,
};

export default AlertDialog;
