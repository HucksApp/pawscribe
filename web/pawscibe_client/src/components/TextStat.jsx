import React from 'react';
import { motion } from 'framer-motion';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//import DescriptionIcon from '@mui/icons-material/Description';
import codeIcon from '../utils/codeIcon';
//import ArticleIcon from '@mui/icons-material/Article';
import FeedIcon from '@mui/icons-material/Feed';
import PublicIcon from '@mui/icons-material/Public';
import PropTypes from 'prop-types';

import { Terminal, Lock } from '@mui/icons-material';
import '../css/filestat.css';

const TextStats = ({ texts }) => {
  //const colorPallet = {js: 'yellow', py:'#00008b', c:'#ff4500',sh :'',php:'#87cefa', html:'', css:''}
  console.log(texts);
  const fileTypes = texts.reduce((acc, text) => {
    const extension = text.file_type;
    acc[extension] = (acc[extension] || 0) + 1;
    return acc;
  }, {});

  console.log(fileTypes);

  const totalFiles = texts.length;
  const privateFiles = texts.filter(text => text.private).length;
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
              <FeedIcon color="action" fontSize="large" />
            </span>
            <span className="span1">ALL SCRIPTS</span>
            <span className="span2">{totalFiles}</span>
          </div>
          <div className="private">
            <span className="icon">
              <Lock color="action" fontSize="large" />
            </span>
            <span className="span1">PRIVATE SCRIPTS</span>
            <spam className="span2">{privateFiles}</spam>
          </div>
          <div className="public">
            <span className="icon">
              <PublicIcon color="action" fontSize="large" />
            </span>
            <span className="span1">PUBLIC SCRIPTS</span>
            <span className="span2">{publicFiles}</span>
          </div>
        </div>
        <div className="typecover">
          {Object.entries(fileTypes).map(([type, count]) => (
            <div className="filetype" key={count}>
              {type === '.pdf' && (
                <PictureAsPdfIcon color="action" fontSize="large" />
              )}
              {type === '.css' && (
                <img className="iconImage" src={codeIcon('css')} />
              )}
              {type === '.ts' && (
                <img className="iconImage" src={codeIcon('ts')} />
              )}
              {type === '.js' && (
                <img className="iconImage" src={codeIcon('js')} />
              )}
              {type === '.html' && (
                <img className="iconImage" src={codeIcon('html')} />
              )}
              {type === '.py' && (
                <img className="iconImage" src={codeIcon('py')} />
              )}
              {type === '.cpp' && (
                <img className="iconImage" src={codeIcon('cpp')} />
              )}
              {type === '.c' && (
                <img className="iconImage" src={codeIcon('c')} />
              )}
              {type === '.rb' && (
                <img className="iconImage" src={codeIcon('rb')} />
              )}
              {type === 'java' && (
                <img className="iconImage" src={codeIcon('sh')} />
              )}
              {type === '.sh' && <Terminal color="action" fontSize="large" />}
              {['.doc', '.docx', '.txt'].includes(type) && (
                <FeedIcon color="action" fontSize="large" />
              )}
              {type !== '.pdf' &&
                ![
                  '.doc',
                  '.docx',
                  '.txt',
                  '.js',
                  '.py',
                  'java',
                  '.c',
                  '.rb',
                  '.cpp',
                  '.css',
                  '.html',
                  '.sh',
                  '.php',
                ].includes(type) && (
                  <InsertDriveFileIcon color="action" fontSize="large" />
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

TextStats.propTypes = {
  texts: PropTypes.array.isRequired,
};
export default TextStats;
