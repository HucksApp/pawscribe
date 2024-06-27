import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { Box, Typography, Paper, Grid } from '@mui/material';

const COLORS = {
  js: '#F0DB4F',
  python: '#306998',
  css: '#264de4',
  ts: '#007acc',
  txt: '#616161',
  // Add more file types and their corresponding colors
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [fileStats, setFileStats] = useState([]);
  const [textStats, setTextStats] = useState([]);

  useEffect(() => {
    // Fetch profile information
    axios.get('/api/profile').then(response => setProfile(response.data));

    // Fetch file statistics
    axios.get('/api/file-stats').then(response => setFileStats(response.data));

    // Fetch text statistics
    axios.get('/api/text-stats').then(response => setTextStats(response.data));
  }, []);

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  const fileData = Object.entries(fileStats).map(([type, count]) => ({
    name: type,
    value: count,
    color: COLORS[type] || '#000',
  }));

  const textData = Object.entries(textStats).map(([type, count]) => ({
    name: type,
    value: count,
    color: COLORS[type] || '#000',
  }));

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Typography variant="h6">Name: {profile.name}</Typography>
        <Typography variant="h6">Email: {profile.email}</Typography>
        <Typography variant="h6">
          Joined: {new Date(profile.joined).toLocaleDateString()}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              File Statistics
            </Typography>
            <PieChart width={400} height={400}>
              <Pie
                data={fileData}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {fileData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Text Statistics
            </Typography>
            <PieChart width={400} height={400}>
              <Pie
                data={textData}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={80}
                fill="#82ca9d"
                dataKey="value"
              >
                {textData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
