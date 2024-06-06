import React from 'react';
import { motion } from 'framer-motion';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import {Css, Javascript, Html, Php, Terminal, Lock, People} from '@mui/icons-material';
import '../css/filestat.css'


const TextStats = ({ texts }) => {
    //const colorPallet = {js: 'yellow', py:'#00008b', c:'#ff4500',sh :'',php:'#87cefa', html:'', css:''}
    console.log(texts)
    const fileTypes = texts.reduce((acc, text) => {
        const extension = text.file_type
        acc[extension] = (acc[extension] || 0) + 1;
        return acc;
    }, {});


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
                    <InsertDriveFileIcon color="action" fontSize="large"/>
                    </span>
                    <span className="span1">ALL SCRIPTS</span>
                    <span className="span2">
                    {totalFiles}
                    </span>
                    </div>
                <div className="private">
                    <span className="icon">
                        <Lock color="action" fontSize="large"/>
                    </span>
                    <span className="span1">PRIVATE SCRIPTS</span>
                    <spam className="span2">
                    {privateFiles}
                    </spam>
                    </div>
                <div className="public">
                <span className="icon">
                    <People color="action" fontSize="large"/>
                    </span>
                    <span className="span1">PUBLIC SCRIPTS</span>
                    <span className="span2">
                    {publicFiles}
                    </span>
                    </div>
            </div>
            <div className="typecover">
                    {Object.entries(fileTypes).map(([type, count]) => (
                        <div className='filetype'>
                            {type === 'pdf' && <PictureAsPdfIcon color="action" fontSize="large"/>}
                            {type === 'css' && <Css color="action" fontSize="large"/>}
                            {type === 'js' && <Javascript color="action" fontSize="large"/>}
                            {type === 'html' && <Html color="action" fontSize="large"/>}
                            {type === 'php' && <Php color="action" fontSize="large"/>}
                            {type === 'sh' && <Terminal color="action" fontSize="large"/>}
                            {['doc', 'docx', 'txt'].includes(type) && <DescriptionIcon color="action" fontSize="large"/>}
                            {['jpg', 'png', 'gif'].includes(type) && <ImageIcon color="action" fontSize="large"/>}
                            {['py', 'java', 'c', 'cpp'].includes(type) && <CodeIcon color="action" fontSize="large"/>}
                            {type !== 'pdf' && !['doc', 'docx', 'txt', 'jpg', 'png', 'gif', 'js', 'py', 'java', 'c', 'cpp','css', 'html', 'sh','php'].includes(type) && <InsertDriveFileIcon color="action" fontSize="large"/>}
                            <div className='div1' >{type.toUpperCase()} <span className='div2'> {count}</span></div>
                        </div>
                    ))}
            </div>
        </div>
        </motion.div>
    );
};

export default TextStats;