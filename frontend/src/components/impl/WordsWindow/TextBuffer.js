export default class TextBuffer {
  constructor() {
    this.text = [];
  }

  add = letter => {
    this.text.push(letter);
  };

  remove = () => {
    this.text.pop();
  };

  clear = () => {
    this.text = [];
  };

  toString = () => {
    return this.text.join('');
  };
}
