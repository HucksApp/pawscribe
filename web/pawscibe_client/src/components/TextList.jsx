import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import TextView from './TextView';
import TextStats from './TextStat';
import AddText from './AddText'
import { Notify } from '../utils/Notification';


const TextList = ({searchValue, stateChanged, setStateChange}) => {
    const [texts, setTexts] = useState([]);
    const [filteredTexts, setFilteredTexts] = useState([]);
    const base = process.env.REACT_APP_BASE_API_URL;
    const token = localStorage.getItem('jwt_token')


    useEffect(() => {
        try{
            const fetchFiles = async () => {
                const response = await axios.get(base + '/Api/v1/text/all',{
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                });
                setTexts(response.data);
                setFilteredTexts(response.data);
            };
            fetchFiles()
        }
        catch(error){
            Notify({message: error.message, type:"error"})
        }
        
    }, []);
    useEffect(() => {
        if(searchValue){
            //setSearchTerm(searchValue);
            setFilteredTexts(texts.filter(text => text.content.toLowerCase().includes(searchValue)));
        }else{
            setFilteredTexts(texts);
        }
    }, [searchValue]);

    return (
        <Container>
            {texts && <TextStats texts={filteredTexts}/>}
            <Grid container spacing={3}>
                <AnimatePresence>
                <AddText/>
                    {filteredTexts.map(text => (
                        <Grid item key={text.id} xs={8} sm={4} md={2}>
                            <TextView
                                text={text}
                            />
                        </Grid>
                    ))}
                </AnimatePresence>
            </Grid>
        </Container>
    );
};

export default TextList;