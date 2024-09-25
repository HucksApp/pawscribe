import React from 'react';
import '../css/logo.css';
import logo from '../images/logo5.svg';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate('/')} className="logo">
      <img src={logo} alt="pawsribe" className="logo_image" />
      <div>PAWSCRIBE</div>
    </div>
  );
};

export default Logo;
