import React, { Component } from 'react';

import { Switch, Route, Link } from 'react-router-dom';

import HomeMenu from './containers/HomeMenu';
import GameMenu from './containers/GameMenu';

class App extends Component {
  render() {
    return (
      <div className="app">
        <nav className="site-navbar">
          <Link to="/">Play TypeRun!</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <Switch>
          <Route exact path="/" component={HomeMenu} />
          <Route path="/live/!:tag" component={GameMenu} />
        </Switch>
      </div>
    );
  }
}

export default App;
