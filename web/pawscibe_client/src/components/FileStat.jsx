import React from 'react';
import { motion } from 'framer-motion';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FeedIcon from '@mui/icons-material/Feed';
import ImageIcon from '@mui/icons-material/Image';
import PublicIcon from '@mui/icons-material/Public';
import codeIcon from '../utils/codeIcon';
import { Php, Terminal, Lock } from '@mui/icons-material';
import '../css/filestat.css';
import PropTypes from 'prop-types';

const FileStats = ({ files }) => {
  //{php:"#87CEFA",pdf:"#A9A9A9",js:"#FFFF00",html:"#FF0000",sh:"#ff4500",css:"#0000FF",py:"#2b35af"}
  console.log(files);
  const fileTypes = files.reduce((acc, file) => {
    const extension = file.filename.split('.').pop().toLowerCase();
    acc[extension] = (acc[extension] || 0) + 1;
    return acc;
  }, {});
  const totalFiles = files.length;
  const privateFiles = files.filter(file => file.private).length;
  const publicFiles = totalFiles - privateFiles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.9 }}
    >
      <div className="filestat">
        <div className="head">
          <div className="total">
            <span className="icon">
              <InsertDriveFileIcon color="action" fontSize="large" />
            </span>
            <span className="span1">TOTAL FILES</span>
            <span className="span2">{totalFiles}</span>
          </div>
          <div className="private">
            <span className="icon">
              <Lock color="action" fontSize="large" />
            </span>
            <span className="span1">PRIVATE FILES</span>
            <spam className="span2">{privateFiles}</spam>
          </div>
          <div className="public">
            <span className="icon">
              <PublicIcon color="action" fontSize="large" />
            </span>
            <span className="span1">PUBLIC FILES</span>
            <span className="span2">{publicFiles}</span>
          </div>
        </div>
        <div className="typecover">
          {Object.entries(fileTypes).map(([type, count]) => (
            <div className="filetype" key={type}>
              {type === 'pdf' && (
                <PictureAsPdfIcon
                  sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
                />
              )}
              {type === 'css' && (
                <img className="iconImage" src={codeIcon(type)} />
              )}
              {type === 'ts' && (
                <img className="iconImage" src={codeIcon(type)} />
              )}
              {type === 'js' && (
                <img className="iconImage" src={codeIcon(type)} />
              )}
              {type === 'html' && (
                <img className="iconImage" src={codeIcon(type)} />
              )}
              {type === 'py' && (
                <img className="iconImage" src={codeIcon(type)} />
              )}
              {type === 'cpp' && (
                <img className="iconImage" src={codeIcon(type)} />
              )}
              {type === 'c' && (
                <img className="iconImage" src={codeIcon(type)} />
              )}
              {type === 'rb' && (
                <img className="iconImage" src={codeIcon(type)} />
              )}
              {type === 'java' && (
                <img className="iconImage" src={codeIcon(type)} />
              )}
              {type === 'php' && (
                <Php
                  sx={{ fontSize: 30, color: '#87CEFA', fontWeight: 1000 }}
                />
              )}
              {type === 'sh' && (
                <Terminal
                  sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
                />
              )}
              {['doc', 'docx', 'txt'].includes(type) && (
                <FeedIcon
                  sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
                />
              )}
              {['jpg', 'png', 'gif', 'svg'].includes(type) && (
                <ImageIcon
                  sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
                />
              )}
              {type !== 'pdf' &&
                ![
                  'doc',
                  'docx',
                  'txt',
                  'jpg',
                  'png',
                  'gif',
                  'js',
                  'py',
                  'java',
                  'svg',
                  'c',
                  'cpp',
                  'css',
                  'html',
                  'sh',
                  'php',
                ].includes(type) && (
                  <InsertDriveFileIcon
                    sx={{ fontSize: 30, color: '#616161' }}
                  />
                )}
              <div className="div1">
                {type.toUpperCase()} <span className="div2"> {count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

FileStats.propTypes = { files: PropTypes.array.isRequired };

export default FileStats;
