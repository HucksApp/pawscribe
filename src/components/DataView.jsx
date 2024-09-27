import React, { useEffect } from 'react';
import FileViewer from 'react-file-viewer';
import { motion } from 'framer-motion';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import PropTypes from 'prop-types';

const DataViewer = ({ src, file, type }) => {
  // Check if file is not defined early to prevent errors
  if (!file) return null;

  useEffect(() => {}, [src, file]);

  // Determine the file extension
  const getFileExtension = () => {
    if (type === 'File') {
      return file?.filename?.split('.').pop().toLowerCase();
    } else if (type === 'Text' || type === 'Script') {
      return file?.file_type?.toLowerCase().replace('.', '');
    }
    return null;
  };

  const extension = getFileExtension();
  console.log('File extension:', extension);

  const renderSvgFile = () => (
    <object
      type="image/svg+xml"
      data={src}
      style={{ width: '100%', height: '100%' }}
    >
      Your browser does not support SVG files.
    </object>
  );

  const renderTextFile = () => (
    <iframe
      src={src}
      style={{ width: '100%', height: '100%', border: 'none' }}
      title={file.filename ? file.filename : file.file_type}
    />
  );

  const renderFile = () => {
    if (!extension) return null;

    switch (extension) {
      case 'pdf':
      case 'jpeg':
      case 'jpg':
      case 'png':
        return <FileViewer fileType={extension} filePath={src} />;

      case 'txt':
      case 'py':
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
      case 'json':
      case 'c':
      case 'java':
      case 'rb':
      case 'cpp':
        return renderTextFile();
      case 'svg':
        return renderSvgFile();
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
      initial={{ x: 300 }}
      animate={{ x: 0 }}
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

DataViewer.propTypes = {
  src: PropTypes.string.isRequired,
  file: PropTypes.shape({
    filename: PropTypes.string,
    file_type: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default DataViewer;
