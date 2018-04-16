import WordsController from './WordsController';

function duplicateRange(arr, start) {
  let end = 0;
  let size = 0;
  let key = arr[start];
  for (let i = start; i < arr.length; ++i) {
    if (key === arr[i]) {
      end = i;
      size++;
    } else {
      break;
    }
  }

  return { end, size };
}

const formatMap = {
  r: 'red',
  g: 'green',
  b: 'black'
};

export default class WordsView {
  constructor() {
    this.wordsController = new WordsController(this);
    this.wordOffset = 10;
  }

  initialize = canvas => {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    window.onkeydown = ({ key }) => {
      this.wordsController.parseInput(key);
    };

    this.wordsController.initialize();
  };

  resize = () => {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth = this.canvas.clientWidth;
    var displayHeight = this.canvas.clientHeight;

    if (
      this.canvas.width != displayWidth ||
      this.canvas.height != displayHeight
    ) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
    }
  };

  startFrame = () => {
    this.resize();
    this.context.fillStyle = 'beige';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  draw = model => {
    this.startFrame();

    this.currentX = 0;

    this.drawActiveWord(model.getActiveWord());

    model.getWordsExcludingActive().forEach(word => {
      this.drawWord(word);
    });

    this.drawEntry(this.wordsController.getTextEntry());
  };

  drawEntry = word => {
    this.context.font = '24px serif';
    this.context.fillStyle = 'black';
    const { width } = this.context.measureText(word);

    this.context.fillText(
      word,
      this.canvas.width / 2 - width / 2,
      this.canvas.height / 2 + 24 * 1.5
    );
  };

  drawWord = word => {
    this.currentX += this.wordOffset;
    this.context.font = '24px serif';
    this.context.fillStyle = 'black';
    this.context.fillText(word, this.currentX, this.canvas.height / 2);
    const { width } = this.context.measureText(word);
    this.currentX += width;
  };

  drawActiveWord = word => {
    this.context.font = '24px serif';
    const attempt = this.wordsController.getTextEntry();
    let index = 0;
    const format = word.split('').map(char => {
      if (index < attempt.length) {
        const input = attempt[index++];
        return input === char ? 'g' : 'r';
      }

      return 'b';
    });

    this.currentX += this.wordOffset;

    index = 0;

    while (index < word.length) {
      const { end, size } = duplicateRange(format, index);

      this.context.fillStyle = formatMap[format[index]];
      let fragment = word.substr(end - size + 1, size);

      const { width } = this.context.measureText(fragment);
      this.context.fillText(fragment, this.currentX, this.canvas.height / 2);
      this.currentX += width;
      index = end + 1;
    }
  };
}
