import React, { useState } from 'react';
import '../css/home.css';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import Modal from '../components/Modal';
import CheckIcon from '@mui/icons-material/Check';

const Home = () => {
  const [open, setOpen] = useState(false);
  const [logon_type, set_logon_type] = useState('');
  const handleOpen_signup = () => {
    set_logon_type('signup');
    setOpen(true);
  };

  const handleOpen_login = () => {
    set_logon_type('login');
    setOpen(true);
  };
  const handleClose = () => {
    set_logon_type('');
    setOpen(false);
  };

  return (
    <div className="home">
      <Modal handleClose={handleClose} logon_type={logon_type} open={open} />
      <div className="head">
        <Logo />
      </div>
      <div className="title">
        <div className="block1">
          Welcome Back to Pawscribe! Your hub for seamless File sharing and
          real-time collaboration.
        </div>
        <div className="block_others">
          <div className="block2">
            <p className="question">Quick Access</p>
            <p className="p1">
              <CheckIcon />
              Access all your files in one place.
            </p>
            <p className="p2">
              <CheckIcon />
              View Files shared with you by others.
            </p>
            <p className="p3">
              <CheckIcon />
              Keep track of recent edits and updates.
            </p>
            <p className="p4">
              <CheckIcon />
              Manage your ongoing collaborations.
            </p>
          </div>
          <div className="block3">
            <p className="question">User Tips</p>
            <p className="p1">
              <CheckIcon />
              Organize Files with tags for easy retrieval.
            </p>
            <p className="p2">
              <CheckIcon />
              Control Files with permission settings.
            </p>
          </div>
        </div>
      </div>
      <div className="buttons">
        <button onClick={handleOpen_login} className="login_button">
          Login
        </button>
        <button onClick={handleOpen_signup} className="signup_button">
          Sign Up
        </button>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
