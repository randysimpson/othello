import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import * as gameActions from '../redux/actions/gameActions';
import Board from './Board';
import PlayerCard from './PlayerCard';
import StatusCard from './StatusCard';
import './Game.css';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  loadGame(id) {
    id = parseInt(id);
    this.props.actions.loadGameDetails(id)
      .then()
      .catch(err => {
        console.log(err);
      });
  }

  handleClick(r, c) {
    const squares = this.props.game.state;
    //only allow click in squares with available actions.
    if(squares[r][c] === 'x' || squares[r][c] === 'o') {
      this.props.actions.putGameAction(this.props.game.id, r, c, this.props.game.status.player.color)
        .then()
        .catch(err => {
          console.log(err);
        });
    }
  }

  getCurrentBoard() {
    let currentBoard = Object.assign({}, this.props.game.state);
    console.log(this.props.game.status);
    if(this.props.game.status && this.props.game.status.availableActions) {
      for(let i = 0; i < this.props.game.status.availableActions.length; i++) {
        currentBoard[this.props.game.status.availableActions[i][0]][this.props.game.status.availableActions[i][1]] = this.props.game.status.player.color.toLowerCase();
      }
    }
    return currentBoard;
  }

  render() {
    const { game, loading } = this.props;
    if(loading) {
      return (
        <div />
      );
    } else if(game) {
      return (
        <div>
          <h3>{game.id}</h3>
          <h4>{game.creationDate.toLocaleString()}</h4>
          <div className="clr-row clr-justify-content-center">
              <div className="clr-col-lg-6 clr-col-12">
                <PlayerCard
                  player={game.player1}
                  score={game.status.score.player1} />
              </div>
              <div className="clr-col-lg-6 clr-col-12">
                <PlayerCard
                  player={game.player2}
                  score={game.status.score.player2} />
              </div>
          </div>
          <div className="clr-row clr-justify-content-center">
            <div className="clr-col-lg-6 clr-col-12">
              <Board
                gameBoard={this.getCurrentBoard()}
                enabled={true}
                onClick={this.handleClick} />
            </div>
            <div className="clr-col-lg-6 clr-col-12">
              <StatusCard
                status={game.status} />
            </div>
          </div>
          <h3>History</h3>
          <div className="clr-row">
            {game.history && game.history.length > 0 && game.history.map((historic) => (
              <div className="clr-col-4">
                <Board
                  gameBoard={historic}
                  enabled={false} />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  let game = state.games.filter((game) => game.id === parseInt(ownProps.match.params.id));
  if(game.length > 0) {
    game = game[0];
  } else {
    game = undefined;
  }
  return {
    game: game,
    loading: state.ajaxCallsInProgress > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //loadDetails: name => dispatch(deploymentActions.loadDeploymentDetails(name)) //when single arg you can ommit the (course) => and just do course =>
    actions: bindActionCreators(gameActions, dispatch) //will bind all actions in the courseActions file to dispatch.
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
