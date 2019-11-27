import React from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

import LoadingBusy from './components/LoadingBusy';
import GamePage from './components/GamePage';
import PlayerForm from './components/PlayerForm';

import AlertAppLevel from './components/clarity/AlertAppLevel';
import SubNav from './components/clarity/SubNav';
import HeaderNav from './components/clarity/HeaderNav';

class App extends React.Component {
  render() {
    const { loading, appLevelAlert } = this.props;
    return (
      <div className="main-container">
        {appLevelAlert.level &&
          <AlertAppLevel
            level={appLevelAlert.level}
            message={appLevelAlert.message} />}
          <Router>
            <header className="header header-6">
              <div className="branding">
                  <span className="title">Othello Project</span>
              </div>
              <HeaderNav>
                <NavLink to="/games" exact className="nav-link nav-text">Games</NavLink>
                <NavLink to="/createPlayer" exact className="nav-link nav-text">Create Player</NavLink>
                <NavLink to="/info" exact className="nav-link nav-text">Info</NavLink>
              </HeaderNav>
            </header>
            <SubNav>
              <ul class="nav">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">List</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Create</a>
                </li>
              </ul>
            </SubNav>
            <div className="content-container">
                <div className="content-area">
                  {loading && <LoadingBusy />}
                  <Switch>
                    <Route path="/games">
                      <GamePage />
                    </Route>
                    <Route path="/info">
                      <Info />
                    </Route>
                    <Route path="/createPlayer">
                      <PlayerForm />
                    </Route>
                    <Route exact path="/">
                      <Home />
                    </Route>
                    <Route path="*">
                      <NoMatch />
                    </Route>
                  </Switch>
              </div>
          </div>
        </Router>
      </div>
    );
  }
}

function Home() {
  return <h2>Home</h2>
}

function Info() {
  return (
    <div>
      <h2>Info</h2>
      <div><a href="https://github.com/randysimpson/othello" target="_blank" rel="noopener noreferrer">GitHub Othello</a></div>
      <div>This project was created to test/build an AI engine to play othello in a tournament for a class project.</div>
      <div><a href="https://www.linkedin.com/in/randall-simpson-356a9111b/" target="_blank" rel="noopener noreferrer">Linkedin</a></div>
    </div>
  );
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
