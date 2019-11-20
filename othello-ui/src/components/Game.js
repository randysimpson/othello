import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from '../redux/actions/gameActions';

import Board from './Board';

class Game extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  loadGame(id) {
    id = parseInt(id);
    this.props.actions.loadGameDetails(id)
      .then()
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { games, loading } = this.props;
    if(loading) {
      return (
        <div />
      );
    } else if(games) {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
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
  return {
    games: state.games,
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
