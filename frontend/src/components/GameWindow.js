import React, { Component } from 'react';

import GameView from './impl/GameWindow/GameView';

export default class GameWindow extends Component {
  constructor(props) {
    super(props);
    this.gameView = new GameView();
  }

  refresh = () => {
    this.gameView.render();
  };

  componentDidMount() {
    if (this.canvas) {
      this.gameView.initialize(this.canvas);
    }

    window.addEventListener('click', this.refresh);
  }

  componentWillUnmount() {
    this.gameView.free();
    window.removeEventListener('click', this.refresh);
  }

  render() {
    return (
      <canvas
        id="game-canvas"
        ref={canvas => {
          this.canvas = canvas;
        }}
      />
    );
  }
}
