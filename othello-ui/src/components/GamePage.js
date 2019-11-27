import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from "react-router-dom";

import * as gameActions from '../redux/actions/gameActions';
import GameList from './GameList';
import Game from './Game';

class GamePage extends React.Component {
  componentDidMount() {
    this.loadGames();
  }

  loadGames() {
    this.props.actions.loadGames()
      .then(() => {
        /*console.log({
          date: new Date(),
          props: this.props,
          state: this.state
        });*/
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <Route exact path="/games/" component={GameList} />
        <Route path="/games/:id" component={Game} exact />
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
