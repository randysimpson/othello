import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as gameActions from '../redux/actions/gameActions';

class GameList extends React.Component {
  constructor(props, context) {
    super(props, context);
    
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
    const { games, loading } = this.props;
    if(loading) {
      return (
        <div />
      );
    } else if(games) {
      console.log(games);
      return (
        <div>
          <ul>
            {games.map(game => (
              <li key={game.id}>
                {game.id} - {game.creationDate.toLocaleString()} - {game.status.message} - {game.status.score.player1} - {game.status.score.player2}
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          no games.
        </div>
      )
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

export default connect(mapStateToProps, mapDispatchToProps)(GameList);