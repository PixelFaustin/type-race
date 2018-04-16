import WordDataBuffer from './WordDataBuffer';

function random32bit() {
  let u = new Uint32Array(1);
  window.crypto.getRandomValues(u);
  let str = u[0].toString(16).toUpperCase();
  return '00000000'.slice(str.length) + str;
}

const randomWords = `astonishing
interesting
north
decide
education
encouraging
acceptable
fork
match
waggish`.split('\n');

export default class WordsModel {
  constructor(view) {
    this.wordsDataBuffer = new WordDataBuffer(10);
    this.wordsView = view;
  }

  initialize = () => {
    let idx = 0;
    const words = randomWords.map(word => {
      return { word, token: random32bit(), index: idx++ };
    });

    this.wordsDataBuffer.add(words);

    this.update();
  };

  getActiveWord = () => {
    const active = this.wordsDataBuffer.words[0];
    return active ? active.word : '';
  };

  getWords = () => {
    return this.wordsDataBuffer.words.map(w => {
      return w.word;
    });
  };

  getWordsExcludingActive = () => {
    return this.wordsDataBuffer.words.slice(1).map(w => {
      return w.word;
    });
  };

  update = () => {
    this.wordsView.draw(this);
  };

  submit = () => {
    this.wordsDataBuffer.removeFirst();
  };
}
