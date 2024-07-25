import React, { useState } from 'react';
import '../css/form.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField } from '@mui/material';
import { Notify } from '../utils/Notification';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const base = process.env.REACT_APP_BASE_API_URL;

  const handleSignup = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(base + '/Api/v1/signup', {
        username,
        password,
        email,
      });
      localStorage.setItem('jwt_token', response.data.token);
      Notify({ message: response.data.message, type: 'success' });
      navigate('/dashboard');
    } catch (error) {
      Notify({
        message: `${error.message} ${error.response.data.message}`,
        type: 'error',
      });
    }
  };

  return (
    <div className="form">
      <div className="title">Signup</div>
      <form onSubmit={handleSignup}>
        <div className="textfield">
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
        <div className="button">
          <button onClick={handleSignup}>Signup</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
