import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as gameActions from '../redux/actions/gameActions';
import GameStats from './GameStats';

class StatsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    //this.loadGames();

    this.state = {
      randomVrandom: [],
      greedyVrandom: [],
      greedyVgreedy: [],
      customVrandom: [],
      customVgreedy: [],
      customVcustom: [],
      isLoaded: false
    };
  }

  filterData() {
    const randomVrandom = this.props.games.filter((game) => game.player1.ip === "othello-random-ai" && game.player2.ip === "othello-random-ai");
    const greedyVrandom = this.props.games.filter((game) => game.player1.ip === "othello-greedy-ai" && game.player2.ip === "othello-random-ai");
    const greedyVgreedy = this.props.games.filter((game) => game.player1.ip === "othello-greedy-ai" && game.player2.ip === "othello-greedy-ai");
    const customVrandom = this.props.games.filter((game) => game.player1.ip === "othello-custom-ai" && game.player2.ip === "othello-random-ai");
    const customVgreedy = this.props.games.filter((game) => game.player1.ip === "othello-custom-ai" && game.player2.ip === "othello-greedy-ai");
    const greedyVcustom = this.props.games.filter((game) => game.player1.ip === "othello-greedy-ai" && game.player2.ip === "othello-custom-ai");
    const customVcustom = this.props.games.filter((game) => game.player1.ip === "othello-custom-ai" && game.player2.ip === "othello-custom-ai");
    this.setState({
      randomVrandom,
      greedyVrandom,
      greedyVgreedy,
      customVrandom,
      customVgreedy,
      customVcustom,
      greedyVcustom,
      isLoaded: true
    });
  }

  render() {
    const { randomVrandom, greedyVrandom, greedyVgreedy, customVrandom, customVgreedy, customVcustom,greedyVcustom, isLoaded } = this.state;
    if(!isLoaded) {
      this.filterData();
    }
    return (
      <div>
        <h2>Stats</h2>
        <h3>Random vs Random</h3>
        {randomVrandom && <GameStats games={randomVrandom} />}
        <h3>Greedy vs Random</h3>
        {greedyVrandom && <GameStats games={greedyVrandom} />}
        <h3>Greedy vs Greedy</h3>
        {greedyVrandom && <GameStats games={greedyVgreedy} />}
        <h3>Custom vs Random</h3>
        {customVrandom && <GameStats games={customVrandom} />}
        <h3>Custom vs Greedy</h3>
        {customVgreedy && <GameStats games={customVgreedy} />}
        <h3>Custom vs Custom</h3>
        {customVcustom && <GameStats games={customVcustom} />}
        <h3>Greedy vs Custom</h3>
        {greedyVcustom && <GameStats games={greedyVcustom} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(StatsPage);
