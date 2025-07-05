import React from 'react';
import './Button.css';

const Button = ({ type = 'primary', onClick, children, ...rest }) => {
  return (
    <button className={`btn btn-${type}`} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export default Button;
