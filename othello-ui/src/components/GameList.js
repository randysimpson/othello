import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as gameActions from '../redux/actions/gameActions';
import DataGrid from './clarity/DataGrid';

class GameList extends React.Component {
  constructor(props, context) {
    super(props, context);

    //this.loadGames();

    this.state = {
      currentPage: 1,
      numOnPage: 10
    };

    this.firstPageClick = this.firstPageClick.bind(this);
    this.prevPageClick = this.prevPageClick.bind(this);
    this.nextPageClick = this.nextPageClick.bind(this);
    this.lastPageClick = this.lastPageClick.bind(this);
    this.textPageChange = this.textPageChange.bind(this);
    this.changeNumOnPage = this.changeNumOnPage.bind(this);
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

  firstPageClick() {
    this.setState({
      currentPage: 1
    });
  }

  prevPageClick() {
    if(this.state.currentPage > 1) {
      this.setState({
        currentPage: this.state.currentPage - 1
      });
    }
  }

  nextPageClick() {
    const total = this.props.games.length;
    const numOnPage = this.state.numOnPage;
    const lastPage = total % numOnPage === 0 ? Math.floor(total / numOnPage) : Math.floor(total / numOnPage) + 1;
    if(this.state.currentPage < lastPage) {
      this.setState({
        currentPage: this.state.currentPage + 1
      });
    }
  }

  lastPageClick() {
    const total = this.props.games.length;
    const numOnPage = this.state.numOnPage;
    this.setState({
      currentPage: total % numOnPage === 0 ? Math.floor(total / numOnPage) : Math.floor(total / numOnPage) + 1
    });
  }

  textPageChange(event) {
    const val = Number(event.target.value);
    const maxPages = Math.floor(this.props.games.length / this.state.numOnPage) + 1;
    if(!isNaN(val) && val <= maxPages && val > 0) {
      this.setState({
        currentPage: event.target.value
      });
    }
  }

  changeNumOnPage(event) {
    this.setState({
      numOnPage: event.target.value
    });
  }

  render() {
    const { games, loading } = this.props;
    const { numOnPage, currentPage } = this.state;
    if(loading) {
      return (
        <div />
      );
    } else if(games.length > 0) {
      console.log(games);
      //temp
      const columns = [{
        id: 1,
        width: '28px',
        title: 'ID'
      }, {
        id: 2,
        width: '50px',
        title: 'Date'
      }, {
        id: 3,
        width: '50px',
        title: 'Status'
      }, {
        id: 4,
        width: '50px',
        title: 'Player 1'
      }, {
        id: 5,
        width: '50px',
        title: 'Player 2'
      }, {
        id: 6,
        width: '25px',
        title: 'X Score'
      }, {
        id: 7,
        width: '25px',
        title: 'Y Score'
      }];

      const data = games.map((game) => {
        return {
          id: game.id,
          columns: [{
            id: 1,
            width: '28px',
            data: game.id,
            href: "/games/" + game.id
          }, {
            id: 2,
            width: '50px',
            data: game.status.date.toLocaleString()
          }, {
            id: 3,
            width: '50px',
            data: game.status.message
          }, {
            id: 4,
            width: '50px',
            data: game.player1.ip ? game.player1.ip : game.player1.name
          }, {
            id: 5,
            width: '50px',
            data: game.player2.ip ? game.player2.ip : game.player2.name
          }, {
            id: 6,
            width: '25px',
            data: game.status.score.player1
          }, {
            id: 7,
            width: '25px',
            data: game.status.score.player2
          }]
        };
      });
      return (
        <div>
          <h2>Games</h2>
          <DataGrid
            columns={columns}
            data={data}
            total={data.length}
            numOnPage={numOnPage}
            currentPage={currentPage}
            firstPageClick={this.firstPageClick}
            prevPageClick={this.prevPageClick}
            nextPageClick={this.nextPageClick}
            lastPageClick={this.lastPageClick}
            textPageChange={this.textPageChange}
            changeNumOnPage={this.changeNumOnPage} />
        </div>
      )
    } else {
      this.loadGames();
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
