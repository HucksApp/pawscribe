import React, { useState } from 'react';
import '../css/form.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField } from '@mui/material';
import { Notify } from '../utils/Notification';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const base = process.env.REACT_APP_BASE_API_URL;

  const handleLogin = async e => {
    setIsDisabled(true);
    e.preventDefault();
    try {
      const response = await axios.post(base + '/Api/v1/login', {
        username,
        password,
      });
      localStorage.setItem('jwt_token', response.data.token);
      dispatch(setUser(response.data.user));
      Notify({ message: response.data.message, type: 'success' });
      setIsDisabled(false);
      navigate('/dashboard');
    } catch (error) {
      setIsDisabled(false);
      if (error.response && error.response.data)
        Notify({
          message: `${error.message} ${error.response.data.message}`,
          type: 'error',
        });
      else
        Notify({
          message: `${error.message}`,
          type: 'error',
        });
    }
  };

  return (
    <div className="form">
      <div className="title">Login</div>
      <form onSubmit={handleLogin}>
        <div className="textfield">
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
          <button disabled={isDisabled} onClick={handleLogin}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
