import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardActions, Button, Menu, MenuItem, IconButton, Typography } from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import ShareIcon from '@mui/icons-material/Share';
import Groups2Icon from '@mui/icons-material/Groups2';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';
import { Notify } from '../utils/Notification';

import '../css/fileview.css'


const FileView = ({ file, setStateChange }) => {
    console.log(file)

    const [anchorEl, setAnchorEl] = useState(null);
    const [iframeSrc, setIframeSrc] = useState('');
    

    const base = process.env.REACT_APP_BASE_API_URL;
    const token = localStorage.getItem('jwt_token')

      useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await axios.get(`${base}/Api/v1/files/download/${file.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                });
                const url = URL.createObjectURL(response.data);
                //const url = URL.createObjectURL(new Blob([response.data]));
                setIframeSrc(url);
                console.log("here====", response.data)
            } catch (error) {
               Notify({message:error.message, type:"error"})
            }
        };

        fetchFile();
    }, [file.id]);

    /*const handleClick = async () => {
        console.log("here")
        const response = await axios.get(`${base}/Api/v1/files/download/${file.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            responseType: 'blob'
        });
        console.log(response.data)
        const url = URL.createObjectURL(new Blob([response.data]));
        setIframeSrc(url);
    }*/

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        try{
        const response = await axios.delete(`${base}/Api/v1/files/${file.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
            Notify({message: response.data.message, type:"success"})
        } 
        catch(error){
            Notify({message: error.message, type:"error"})
        }
        setStateChange(true)
        handleMenuClose();
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.target ="_blank"
        link.href = iframeSrc;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
        handleMenuClose();
        Notify({message:"File Downloaded", type:"success"})
       
    };

    const handlePrivacy = async () => {
        try{
            const response = await axios.get(`${base}/Api/v1/files/private/${file.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
                Notify({message: response.data.message, type:"success"})
                console.log(response.data)
            } 
            catch(error){
                Notify({message: error.message, type:"error"})
            }
            setStateChange(true)
            handleMenuClose();
    };

    const handleEdit = () => {
        // Edit logic here
        handleMenuClose();
    };

    const handleShare = async () => {
        try{
            const response = await axios.get(`${base}/Api/v1/files/share/${file.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
                Notify({message: response.data.message, type:"success"})
                console.log(response.data, "====================")
            } 
            catch(error){
                Notify({message: error.message, type:"error"})
            }
            setStateChange(true)
            handleMenuClose();
    };

    let PrivateViewIcon
    if(file.private == true){
        PrivateViewIcon = LockIcon
    }
    else(
        PrivateViewIcon = LockOpenIcon 
    )



    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.9 }}
        >
            <div className='card'>
                <CardContent>
                    <Typography variant="h6">{file.name}</Typography>
                    <iframe
                        src={iframeSrc}
                        style={{ width: '100%', height: '200px', border: 'none' }}
                    
                        title={file.name}
                    ></iframe>
                </CardContent>
                <CardActions>
                    <IconButton onClick={handleMenuOpen}>
                        <MoreVertIcon color="primary" />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleEdit}><EditIcon sx={{ fontSize: 25, color:'#616161', paddingRight: 1}}/><div className="menuitem"> Edit</div></MenuItem>
                        <MenuItem onClick={handleDelete}><DeleteIcon sx={{ fontSize: 25, color:'#616161', paddingRight: 1}} /><div className="menuitem">Delete</div></MenuItem>
                        <MenuItem onClick={handleShare}><ShareIcon sx={{ fontSize: 25, color:'#616161', paddingRight: 1}} /><div className="menuitem">Share</div></MenuItem>
                        <MenuItem onClick={handleDownload}><FileDownloadIcon sx={{ fontSize: 25, color:'#616161', paddingRight: 1}} /><div className="menuitem">Download</div></MenuItem>
                        <MenuItem onClick={handleShare}><Groups2Icon sx={{ fontSize: 25, color:'#616161', paddingRight: 1}} /><div className="menuitem">Collaborate</div></MenuItem>
                        <MenuItem onClick={handlePrivacy}><PrivateViewIcon sx={{ fontSize: 25, color:'#616161', paddingRight: 1}}/><div className="menuitem">Privacy</div></MenuItem>
                        <MenuItem onClick={handleDownload}><InfoIcon sx={{ fontSize: 25, color:'#616161', paddingRight: 1}} /><div className="menuitem">File Details</div></MenuItem>
                    </Menu>
                </CardActions>
            </div>
        </motion.div>
    );
};

export default FileView;