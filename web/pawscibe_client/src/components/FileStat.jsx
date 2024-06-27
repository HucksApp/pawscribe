import React from 'react';
import { motion } from 'framer-motion';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import {
  Css,
  Javascript,
  Html,
  Php,
  Terminal,
  Lock,
  People,
} from '@mui/icons-material';
import '../css/filestat.css';

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
              <People color="action" fontSize="large" />
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
                <Css
                  sx={{ fontSize: 30, color: '#0000FF', fontWeight: 1000 }}
                />
              )}
              {type === 'js' && (
                <Javascript
                  sx={{ fontSize: 30, color: '#9B870C', fontWeight: 1000 }}
                />
              )}
              {type === 'html' && (
                <Html
                  sx={{ fontSize: 30, color: '#FF0000', fontWeight: 1000 }}
                />
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
                <DescriptionIcon
                  sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
                />
              )}
              {['jpg', 'png', 'gif'].includes(type) && (
                <ImageIcon
                  sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
                />
              )}
              {['py', 'java', 'c', 'cpp'].includes(type) && (
                <CodeIcon
                  sx={{ fontSize: 30, color: '#2b35af', fontWeight: 1000 }}
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

export default FileStats;
