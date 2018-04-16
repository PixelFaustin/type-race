import React, { Component } from 'react';

import PlayerPortrait from '../components/PlayerPortrait';

export default class GameScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="game-container">
        <div className="waiting-screen">
          <div className="race-settings">
            <h3>Race Settings</h3>
            <input
              placeholder="placeholder"
              name="a"
              type="text"
              className="input-form"
            />
            <input
              placeholder="placeholder"
              name="b"
              type="text"
              className="input-form"
            />
          </div>
          <div className="race-logistics">
            <div className="active-players">
              {this.props.playerlist.map(id => (
                <PlayerPortrait
                  playerName={id}
                  key={id}
                  isLeader={this.props.playerlist[0] === id}
                />
              ))}
            </div>
            <div className="start-menu">
              <button className="btn-ok" onClick={this.props.handleStart}>
                Start Race!
              </button>
              <h3>Invite other players!</h3>
              <input
                id="invite-url"
                type="text"
                readonly
                value={window.location.href}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
