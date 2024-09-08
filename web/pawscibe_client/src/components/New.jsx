import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import FeedIcon from '@mui/icons-material/Feed';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import PropTypes from 'prop-types';
import NewDialog from './NewDialog';
import {
  Card,
  CardContent,
  Typography,
  //IconButton,
} from '@mui/material';

const New = ({ type, onSelect, setModalOpen }) => {
  const [valname, setValname] = useState('');
  const [item, setItem] = useState({ type: type, new: true });
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setValname('');
    setModalOpen(false);
  };

  const includeNew = () => {
    setItem(prevState => {
      const newval = { ...prevState, name: valname };
      onSelect(newval);
      console.log(newval, item);
      return newval;
    });
    console.log(item);
  };

  const handleClickOpen = () => {
    setOpen(true);
    //setModalOpen(false);
  };

  const resolv = type => {
    if (type == 'File') {
      // setItem({
      //   //...item,
      //   filename: valname,
      //   content: '',
      // });
      return (
        <InsertDriveFileIcon
          sx={{
            fontSize: 40,
            color: '#616161',
            fontWeight: 1000,
          }}
        />
      );
    } else if (type == 'Text') {
      // setItem({
      //   //...item,
      //   file_type: valname,
      //   content: '',
      // });
      return (
        <FeedIcon
          sx={{
            fontSize: 40,
            color: '#616161',
            fontWeight: 1000,
          }}
        />
      );
    } else if (type == 'Folder') {
      // setItem({
      //   ...item,
      //   foldername: valname,
      // });
      return (
        <FolderIcon
          sx={{
            fontSize: 40,
            color: '#616161',
            fontWeight: 1000,
          }}
        />
      );
    }
  };

  return (
    <div className="">
      <Card onClick={handleClickOpen}>
        <CardContent>
          {resolv(type)}
          <Typography
            sx={{
              fontSize: 25,
              color: '#616161',
              fontFamily: 'Raleway',
              fontWeight: 1000,
            }}
            variant="h6"
          >
            {`Blank ${type}`}
          </Typography>
        </CardContent>
      </Card>
      <NewDialog
        type={type}
        valname={valname}
        setValname={setValname}
        handleClose={handleClose}
        open={open}
        handleAdd={includeNew}
      />
    </div>
  );
};

New.propTypes = {
  type: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  setModalOpen: PropTypes.bool.isRequired,
};

export default New;
