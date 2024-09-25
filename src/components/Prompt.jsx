import React from 'react';
import PropTypes from 'prop-types';
import '../css/prompt.css';

const Prompt = ({ user, root }) => {
  return (
    <span className="prompt">
      <span className="user">{user}</span>
      <span className="pos">@</span>
      <span className="paws">pawscribe</span>
      <span className="pos">:</span>
      <span className="root">{root}</span>
      <span className="cusor">$</span>
    </span>
  );
};

Prompt.propTypes = {
  user: PropTypes.string.isRequired,
  root: PropTypes.string.isRequired,
};

export default Prompt;
