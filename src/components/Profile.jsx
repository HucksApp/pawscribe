import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
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
  const [fileData, setFileData] = useState([]);
  const [textData, setTextData] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalTexts, setTotalTexts] = useState(0);
  const user = useSelector(state => state.user);
  const base = process.env.REACT_APP_BASE_API_URL;
  const token = localStorage.getItem('jwt_token');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!token) navigate('/');

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(base + '/Api/v1/user/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { file_type_count, text_type_count, total_files, total_texts } =
        response.data;

      // Prepare file data for PieChart
      const fileDataFormatted = file_type_count
        ? Object.entries(file_type_count).map(([type, count]) => ({
            id: type,
            value: count,
            label: `${type.toUpperCase()} (${count})`,
            color: fileTypeColors(type),
          }))
        : [];

      // Prepare text data for PieChart
      const textDataFormatted = text_type_count
        ? Object.entries(text_type_count).map(([type, count]) => ({
            id: type,
            value: count,
            label: `${type.toUpperCase()} (${count})`,
            color: fileTypeColors(type.replace('.', '')),
          }))
        : [];
      console.log(fileDataFormatted, textDataFormatted, '++++++++');
      setFileData(fileDataFormatted);
      setTextData(textDataFormatted);
      setTotalFiles(total_files || 0);
      setTotalTexts(total_texts || 0);
    } catch (error) {
      if (error.response) {
        if (error.response.data.msg === 'Token has expired') {
          localStorage.removeItem('jwt_token');
          dispatch(clearUser());
          navigate('/');
        } else {
          Notify({
            message: `${error.message}. ${error.response.data.message}`,
            type: 'error',
          });
        }
      } else {
        Notify({ message: `${error.message}`, type: 'error' });
      }
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

  useEffect(() => {
    if (!user) fetchUser();
    fetchUserStats();
  }, [user]);

  return (
    <>
      <Appbar />
      <Box sx={{ padding: 3, minHeight: '100vh', overflow: 'scroll' }}>
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
          {fileData.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{ padding: 2, bgcolor: '#D8D8D8', height: 350 }}
              >
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
                  All File Type ({totalFiles})
                </Typography>
                <PieChart
                  series={[
                    {
                      data: fileData,
                      outerRadius: 120,
                      innerRadius: 60, // For doughnut chart
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: -45,
                      endAngle: 225,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: 'gray',
                      },
                    },
                  ]}
                  height={300}
                  sx={{
                    '& .MuiChartsLegend-series text': {
                      fontWeight: '1000 !important',
                      fontFamily: 'Raleway !important',
                    },
                  }}
                />
              </Paper>
            </Grid>
          )}

          {textData.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{ padding: 2, bgcolor: '#D8D8D8', height: 350 }}
              >
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
                  All Script Type ({totalTexts})
                </Typography>
                <PieChart
                  series={[
                    {
                      data: textData,
                      outerRadius: 120,
                      innerRadius: 60, // For doughnut chart
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: -45,
                      endAngle: 225,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: 'gray',
                      },
                    },
                  ]}
                  height={300}
                  sx={{
                    '& .MuiChartsLegend-series text': {
                      fontWeight: '1000 !important',
                      fontFamily: 'Raleway !important',
                    },
                  }}
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
