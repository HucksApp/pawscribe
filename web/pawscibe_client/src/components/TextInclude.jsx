import React, { useState, useEffect } from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FeedIcon from '@mui/icons-material/Feed';
import ImageIcon from '@mui/icons-material/Image';
import PropTypes from 'prop-types';
import {
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  //IconButton,
} from '@mui/material';
import {
  //Css,
  Javascript,
  //Html,
  //Php,
  //Terminal,
  // Lock,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import CodeIcon from '@mui/icons-material/Code';
import { motion } from 'framer-motion';

const TextInclude = ({ onSelect }) => {
  const texts = useSelector(state => state.texts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredtexts, setFilteredtexts] = useState([]);
  //const [iframeSrc, setIframeSrc] = useState('');

  /*useEffect(() => {
    const settextobj = async () => {
      try {
        const url = URL.createObjectURL(new Blob([text.content]));
        setIframeSrc(url);
      } catch (error) {
        console.error('Error fetching the file:', error);
      }
    };

    settextobj();
  }, [text.id]);*/

  const icon = text => {
    switch (text.file_type.replace('.', '')) {
      case 'py':
        return (
          <CodeIcon
            sx={{
              fontSize: 40,
              color: '#3776AB',
              fontWeight: 1000,
            }}
          />
        );
      case 'js':
        return (
          <Javascript
            sx={{
              fontSize: 40,
              color: '#F7DF1E',
              fontWeight: 1000,
            }}
          />
        );

      case 'doc':
      case 'txt':
        return (
          <FeedIcon
            sx={{
              fontSize: 40,
              color: '#000000',
              fontWeight: 1000,
            }}
          />
        );
      case 'pdf':
        return (
          <PictureAsPdfIcon
            sx={{
              fontSize: 40,
              color: '#FF0000',
              fontWeight: 1000,
            }}
          />
        );

      case 'svg':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return (
          <ImageIcon
            sx={{
              fontSize: 40,
              color: '#4285F4',
              fontWeight: 1000,
            }}
          />
        );
      default:
        return (
          <FeedIcon
            sx={{
              fontSize: 40,
              color: '#616161',
              fontWeight: 1000,
            }}
          />
        );
    }
  };

  useEffect(() => {
    setFilteredtexts(
      texts.filter(text =>
        text.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, texts]);

  return (
    <div>
      <TextField
        label="Search Scrips"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2}>
        {filteredtexts.map(text => (
          <Grid item xs={3} key={text.id}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.9 }}
            >
              <Card onClick={() => onSelect(text)}>
                <CardContent>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    {icon(text)}
                    <Typography
                      sx={{
                        fontSize: 25,
                        color: '#616161',
                        fontFamily: 'Raleway',
                        fontWeight: 1000,
                      }}
                      variant="h6"
                    >
                      {text.file_type}
                    </Typography>
                  </div>
                  <iframe
                    src={URL.createObjectURL(new Blob([text.content]))}
                    style={{ width: '100%', height: '100px', border: 'none' }}
                    title={text.file_type}
                  ></iframe>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

TextInclude.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default TextInclude;
