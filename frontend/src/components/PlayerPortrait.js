import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

export default class PlayerPortrait extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="player-profile">
        {this.props.isLeader ? (
          <img className="leader-decorator" src="/images/leader.png" />
        ) : (
          <div style={{ width: '32px', height: '32px' }} />
        )}
        <img
          className="player-portrait"
          src="https://picsum.photos/64/64/?random"
        />
        <span className="player-name">
          {this.props.playerName.substring(0, 14)}
        </span>
      </div>
    );
  }
}
