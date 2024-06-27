import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FileDetailsDrawer from './FileDetailsDrawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FeedIcon from '@mui/icons-material/Feed';
import DownloadIcon from '@mui/icons-material/Download';
import DataViewer from './DataView';
import { Notify } from '../utils/Notification';
import Footer from './Footer';
import '../css/dataview.css';

const OpenViewFile = ({ files, setFiles }) => {
  //const {dataType, id} = useParams()
  ///console.log(dataType, id)
  //file, onClose, open
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const id = params.get('id');
  const src = params.get('src');

  const navigate = useNavigate();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = src;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Notify({ message: 'File Downloaded', type: 'success' });
  };

  console.log(files);
  return (
    <div className="opendataview">
      <div className="opeviewtoolbar">
        <ArrowBackIcon
          className="tool"
          onClick={() => navigate('/dashboard')}
          sx={{ fontSize: 40, color: '#616161', fontWeight: 1000 }}
        />
        <FeedIcon
          className="tool"
          onClick={() => setDrawerOpen(true)}
          sx={{ fontSize: 40, color: '#616161', fontWeight: 1000 }}
        />
        <DownloadIcon
          className="tool"
          onClick={handleDownload}
          sx={{ fontSize: 40, color: '#616161', fontWeight: 1000 }}
        />
      </div>
      {files
        .filter(file => file.id === parseInt(id))
        .map(file => {
          return (
            <div key={file.id}>
              <FileDetailsDrawer
                file={file}
                setFiles={setFiles}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                setParams={setParams}
              />
              <DataViewer file={file} setFiles={setFiles} src={src} />
            </div>
          );
        })}
      <Footer />
    </div>
  );
};

export default OpenViewFile;
