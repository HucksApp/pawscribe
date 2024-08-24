import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import OpenFolderList from './OpenFolderList';

const OpenFolderView = () => {
  const [searchParams] = useSearchParams();
  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [subfolders, setSubfolders] = useState([]);

  const folderId = searchParams.get('folderId');

  useEffect(() => {
    const fetchFolderContents = async () => {
      const base = process.env.REACT_APP_BASE_API_URL;
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await axios.get(`${base}/Api/v1/folders/${folderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFolder(response.data.folder);
        setFiles(response.data.files);
        setSubfolders(response.data.subfolders);
      } catch (error) {
        console.error('Failed to fetch folder contents:', error);
      }
    };

    fetchFolderContents();
  }, [folderId]);

  if (!folder) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{folder.foldername}</h1>
      <OpenFolderList folder={folder} files={files} subfolders={subfolders} />
    </div>
  );
};

export default OpenFolderView;
