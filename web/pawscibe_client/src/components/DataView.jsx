import React from 'react';
import FileViewer from 'react-file-viewer';
//import { Document, Page } from 'react-pdf';
//import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { motion } from 'framer-motion';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const DataViewer = ({ src, file }) => {
  if (!file) return null;

  const renderFile = () => {
    const extension = file.filename.split('.')[1];
    console.log(extension);
    switch (extension) {
      //return <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{/*file.content*/}</pre>;
      case '.txt':
      case 'pdf':
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'svg':
        return (
          <FileViewer
            fileType={extension}
            filePath={src}
            //errorComponent={CustomErrorComponent}
            //onError={this.onError}
          />
        );
      //return <img src={file} alt={file.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />;
      default:
        return (
          <div className="unsupported">
            <ImageNotSupportedIcon
              sx={{
                fontSize: 25,
                color: '#616161',
                fontWeight: 1000,
                height: 200,
                width: 200,
              }}
            />
            <p className="unsupported_title">
              Open View of file type Unavailable
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ rotate: 360, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      <div style={{ height: '80vh', width: '100%', marginTop: '20px' }}>
        {renderFile()}
      </div>
    </motion.div>
  );
};

export default DataViewer;
