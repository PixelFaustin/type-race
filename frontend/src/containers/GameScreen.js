import React, { Component } from 'react';

import WordsWindow from '../components/WordsWindow';
import GameWindow from '../components/GameWindow';

export default class GameScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="game-container">
        <div className="game-screen">
          <div className="col">
            <WordsWindow />
            <GameWindow />
          </div>
        </div>
      </div>
    );
  }
}
