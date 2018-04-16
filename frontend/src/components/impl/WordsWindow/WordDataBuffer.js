/** 
 * 
const Word = {
  word: 'elephant',
  token: random32bit(),
  index: 0
};
 * 
*/
export default class WordDataBuffer {
  constructor(desiredSize) {
    this.preferredSize = desiredSize;
    this.words = [];
  }

  add = wordData => {
    if (Array.isArray(wordData)) {
      this.words = this.words.concat(wordData);
    } else {
      this.words.push(wordData);
    }
    this.words.sort((a, b) => {
      return a.index - b.index;
    });
  };

  remove = i => {
    this.words = this.words.splice(i, 1);
  };

  removeFirst = () => {
    this.words.shift();
  };
}
