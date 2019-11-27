import React from 'react';
import './Square.css';

const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value === 'X' && <span className="black-dot"></span>}
      {props.value === 'O' && <span className="white-dot"></span>}
      {props.value === 'x' && <span className="black-dot-possible"></span>}
      {props.value === 'o' && <span className="white-dot-possible"></span>}
    </button>
  );
}

export default Square;
