import TextBuffer from './TextBuffer';
import WordsModel from './WordsModel';

export default class WordsController {
  constructor(view) {
    this.textBuffer = new TextBuffer();
    this.wordsModel = new WordsModel(view);
  }

  handleLetter = letter => {
    if (this.textBuffer.text.length < this.wordsModel.getActiveWord().length) {
      this.textBuffer.add(letter);
    }
  };

  handleBackspace = () => {
    this.textBuffer.remove();
  };

  handleSpace = () => {
    const attemptLength = this.textBuffer.text.length;
    if (attemptLength > 0) {
      this.wordsModel.submit();
      this.textBuffer.clear();
    }
  };

  parseInput = key => {
    if (key.length === 1 && key.match(/[a-z]/i)) {
      this.handleLetter(key);
    } else if (key.toLowerCase() === 'backspace') {
      this.handleBackspace();
    } else if (key === ' ') {
      this.handleSpace();
    }

    this.wordsModel.update();
  };

  getTextEntry = () => {
    return this.textBuffer.toString();
  };

  initialize = () => {
    this.wordsModel.initialize();
  };
}
