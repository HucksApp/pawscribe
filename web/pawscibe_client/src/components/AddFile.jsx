import React,{useState} from 'react'
import axios from 'axios';
import {  Menu, MenuItem, IconButton } from '@mui/material';
import { AddBox as AddIcon} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import UploadIcon from '@mui/icons-material/Upload';
import '../css/add.css'
import { Notify } from '../utils/Notification';





const AddFile = ({fetchFiles, setStateChange}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [newFile, setNewFile] = useState({})
    const [previewUrl, setPreviewUrl] = useState("")

    const base = process.env.REACT_APP_BASE_API_URL;
    const token = localStorage.getItem('jwt_token')

    const handleOnUpload = (event) =>{
        //console.log()
        setNewFile(event.target.files[0])
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        console.log(previewUrl)
    }



    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const sendUpload = (e)=>{
        console.log(newFile)

        let data = new FormData()
        data.append('file', newFile)

        try{
            const sendFile = async () => {
                const response = await axios.post(base + '/Api/v1/files/upload',data,{
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            'content-type': 'multipart/form-data',
                        }
                });
                Notify({message: response.data.message, type: "success"})
            };
            sendFile()
            setStateChange(true)
        }catch(error)
        {
            Notify({message: error.message, type:"error"})
        }
        handleMenuClose()
    }


    const handleDelete = async () => {
      
        //
        if(Object.keys(newFile).length != 0){
            handleMenuClose();
        }

    };

    const handleEdit = () => {
        // Edit logic here
        handleMenuClose();
    };

    const handleShare = () => {
        // Share logic here
        handleMenuClose();
    };

  return (
    <div className="add">
        <IconButton onClick={handleMenuOpen}>
            <AddIcon color="secondary" fontSize="large" />
        </IconButton>
        <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        >
            <MenuItem onClick={handleEdit}><InsertDriveFileIcon color="secondary"  /><div className="menuitem"> Blank File</div></MenuItem>
            <MenuItem><UploadIcon color="secondary" /><input className="uploadfile" onChange={handleOnUpload} type="file" /> <button onClick={sendUpload}>Upload File</button></MenuItem>
        </Menu>
    </div>
  )
}


export  default AddFile;
