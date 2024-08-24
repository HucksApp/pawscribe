import React, { useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MailIcon from '@mui/icons-material/Mail';
import FeedIcon from '@mui/icons-material/Feed';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { setUser } from '../store/userSlice';
import { Notify } from '../utils/Notification';
import { clearUser } from '../store/userSlice';
import Appbar from './Appbar';

const Profile = () => {
  const files = useSelector(state => state.files);
  const texts = useSelector(state => state.texts);
  const user = useSelector(state => state.user);
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  //const token = localStorage.getItem('jwt_token');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log('======>', user, files, texts);

  if (!token) navigate('/');
  const fileType = type => {
    switch (type) {
      case 'py':
        return 'Python';
      case 'js':
        return 'Javascript';
      case 'txt':
        return 'Text Document';
      case 'pdf':
        return 'Pdf Document';
      case 'doc':
        return 'Document';
      case 'svg':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'Image File';
      default:
        return 'File';
    }
  };

  const fileTypeColors = type => {
    switch (type) {
      case 'py':
        return '#3776AB';
      case 'js':
        return '#F7DF1E';
      case 'txt':
        return '#000000';
      case 'pdf':
        return '#FF0000';
      case 'doc':
        return '#4285F4';
      case 'svg':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return '#616161';
      default:
        return '#000000';
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(base + '/Api/v1/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.user);
      dispatch(setUser(response.data.user));
    } catch (error) {
      if (error.response)
        if (
          error.response.data.msg &&
          error.response.data.msg === 'Token has expired'
        ) {
          localStorage.removeItem('jwt_token');
          dispatch(clearUser());
          navigate('/');
        } else
          Notify({
            message: `${error.message}. ${error.response.data.message} `,
            type: 'error',
          });
      else
        Notify({
          message: `${error.message}`,
          type: 'error',
        });
    }
  };

  // Aggregate data for charts
  const fileTypeCount = files.reduce((acc, file) => {
    const type = file.filename.split('.').pop();
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const textTypeCount = texts.reduce((acc, text) => {
    acc[text.file_type] = (acc[text.file_type] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for BarChart  { data: [3, 4, 1, 6, 5], stack: 'A', label: 'Series A1' }
  const fileData = Object.entries(fileTypeCount).map(([type, count]) => ({
    stack: type,
    data: [count],
    color: fileTypeColors(type),
    label: fileType(type),
  }));
  const textData = Object.entries(textTypeCount).map(([type, count]) => ({
    stack: type.replace('.', ''),
    data: [count],
    color: fileTypeColors(type.replace('.', '')),
    label: fileType(type.replace('.', '')),
  }));

  console.log('======>....', fileData, textData, user);

  useEffect(() => {
    if (!user) fetchUser();
    console.log('hereeee', user);
  }, [user, files, texts]);

  return (
    <>
      <Appbar />
      <Box
        sx={{
          padding: 3,
          minHeight: '100vh',
          overflow: 'scroll',
        }}
      >
        {user && (
          <div className="headtitle">
            <Typography
              sx={{
                fontSize: 25,
                color: '#616161',
                fontFamily: 'Raleway',
                fontWeight: 1000,
              }}
              variant="h4"
              gutterBottom
            >
              Profile of {user.username}
            </Typography>
            <Typography
              sx={{
                color: '#616161',
                fontFamily: 'Raleway',
                fontWeight: 1000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              variant="subtitle1"
              gutterBottom
            >
              <MailIcon
                sx={{ fontSize: 20, color: '#616161', fontWeight: 1000 }}
              />{' '}
              {user.email}
            </Typography>
          </div>
        )}

        <Grid container spacing={3}>
          {files && (
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2, bgcolor: '#D8D8D8' }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#616161',
                    fontFamily: 'Raleway',
                    fontWeight: 1000,
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  <InsertDriveFileIcon
                    sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
                  />
                  File Types
                </Typography>
                <BarChart
                  sx={{
                    color: '#616161',
                    fontFamily: 'Raleway',
                    fontWeight: 1000,
                  }}
                  series={[...fileData]}
                  xField="type"
                  yField="count"
                  axis={{ x: { label: 'File Type' }, y: { label: 'Count' } }}
                  height={300}
                />
              </Paper>
            </Grid>
          )}

          {texts && (
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2, bgcolor: '#D8D8D8' }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#616161',
                    fontFamily: 'Raleway',
                    fontWeight: 1000,
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  <FeedIcon
                    sx={{ fontSize: 30, color: '#616161', fontWeight: 1000 }}
                  />
                  Script Types
                </Typography>
                <BarChart
                  series={[...textData]}
                  xField="type"
                  yField="count"
                  axis={{ x: { label: 'Text Type' }, y: { label: 'Count' } }}
                  height={300}
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default Profile;
