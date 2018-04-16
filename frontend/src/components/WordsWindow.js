import React, { Component } from 'react';

import WordsView from './impl/WordsWindow/WordsView';

export default class WordsWindow extends Component {
  constructor(props) {
    super(props);
    this.wordsView = new WordsView();
  }

  componentDidMount() {
    if (this.canvas) {
      this.wordsView.initialize(this.canvas);
    }
  }

  render() {
    return (
      <canvas
        id="words-canvas"
        ref={canvas => {
          this.canvas = canvas;
        }}
      />
    );
  }
}
