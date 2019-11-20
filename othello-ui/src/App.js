import React from 'react';
import { connect } from 'react-redux';

import LoadingBusy from './components/LoadingBusy';
import GameList from './components/GameList';
import AlertAppLevel from './components/clarity/AlertAppLevel';

class App extends React.Component {
  render() {
    const { loading, appLevelAlert } = this.props;
    return (
      <div className="main-container">
        {appLevelAlert && <AlertAppLevel />}
          <header className="header header-6">
            <div className="branding">
                <span className="title">Othello Project</span>
            </div>
            <div className="header-nav">
                <a href="javascript://" className="active nav-link nav-text">Games</a>
                <a href="javascript://" className="nav-link nav-text">Info</a>
            </div>
          </header>
          <nav className="subnav">
              ...
          </nav>
          <div className="content-container">
              <div className="content-area">
                {loading && <LoadingBusy />}
                <GameList />
              </div>
              <nav className="sidenav">
                  ...
              </nav>
          </div>
      </div>
    );
  }
}

function NoMatch() {
  return <h2>404 Not Found</h2>;
}

function mapStateToProps(state, ownProps) {
  return {
    loading: state.ajaxCallsInProgress > 0,
    appLevelAlert: state.appLevelAlert
  };
}

export default connect(mapStateToProps)(App);
