import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const NewDialog = ({
  type,
  valname,
  setValname,
  handleClose,
  open,
  handleAdd,
}) => {
  return (
    <div className="newdialog">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New {type}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={`${type} Name`}
            type="text"
            fullWidth
            value={valname}
            onChange={e => setValname(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            sx={{ fontFamily: 'Raleway', fontWeight: 1000 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            color="primary"
            sx={{ fontFamily: 'Raleway', fontWeight: 1000 }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

NewDialog.propTypes = {
  type: PropTypes.string.isRequired,
  valname: PropTypes.string.isRequired,
  setValname: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleAdd: PropTypes.func.isRequired,
};

export default NewDialog;
