import React from 'react';

import Square from './Square';
import './Board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      //squares: Array(9).fill(null),
      squares: props.gameBoard,
      enabled: props.enabled
    };
  }

  renderSquare(r, c) {
    return (
      <Square
        value={this.state.squares[r][c]}
        onClick={() => this.props.onClick(r, c)}
      />
    );
  }

  renderRow(r) {
    return (
      <div className="board-row">
        {this.renderSquare(r, 0)}
        {this.renderSquare(r, 1)}
        {this.renderSquare(r, 2)}
        {this.renderSquare(r, 3)}
        {this.renderSquare(r, 4)}
        {this.renderSquare(r, 5)}
        {this.renderSquare(r, 6)}
        {this.renderSquare(r, 7)}
      </div>
    )
  }

  render() {
    return (
      <div className="game-board">
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
        {this.renderRow(3)}
        {this.renderRow(4)}
        {this.renderRow(5)}
        {this.renderRow(6)}
        {this.renderRow(7)}
      </div>
    );
  }
}

export default Board;
