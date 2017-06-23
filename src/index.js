import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.clazz} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor() {
    super();
    var rows = 20;
    var columns = 20;
    var bombs = 50;
    this.state = {
      squares: generateMinefield(rows, columns, bombs),
      visibleSquares: Array(columns * rows).fill(false),
      rows: rows,
      columns: columns,
      bombs:bombs,
    };
  }


 renderSquare(i) {
  var clazz = "square";
  if (i % this.state.columns === 0) {
    clazz = "next-line square";
  }

  var value = "";
  if (this.state.visibleSquares[i]) {
      value = this.state.squares[i];
  }

    return (
      <Square clazz={clazz}
        value={value}
        onClick={() => this.handleClick(i)}
      />
    );
  }


   handleClick(i) {
    if (this.state.visibleSquares[i]) {
      return;
    }


    const visibleSquares = this.state.visibleSquares.slice();

    var x = i % this.state.rows;
    var y = Math.floor(i / this.state.columns);
    reveal(this.state.squares, visibleSquares, x, y, this.state.rows, this.state.columns);

     this.setState({
      visibleSquares: visibleSquares
    });
  }


  render() {
    var indents = [];
    for (var r = 0; r < this.state.rows; r++) {
      for (var c = 0; c < this.state.columns; c++) {
         indents.push(this.renderSquare( (r * this.state.columns) + c));
      }
    }

    return (
      <div>
        <h1>Bombs: {this.state.bombs}</h1>
        {indents}
      </div>
    );
  }
}


class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function generateMinefield(rows, columns, bombs) {
  var totalSquares = rows * columns;
  var minefield = Array(totalSquares).fill(0);

  for (var i = 0; i < bombs; i++) {
    minefield[i] = '*';
  }

  shuffleArray(minefield);

  var x, y;
  for (var i = 0; i < totalSquares; i++) {
    if (minefield[i] != '*') {
      x = i % rows;
      y = Math.floor(i / columns);

      minefield[i] += check(minefield, x - 1, y, rows, columns);
      minefield[i] += check(minefield, x + 1, y, rows, columns);
      minefield[i] += check(minefield, x, y - 1, rows, columns);
      minefield[i] += check(minefield, x, y + 1, rows, columns);
      minefield[i] += check(minefield, x + 1, y + 1, rows, columns);
      minefield[i] += check(minefield, x + 1, y - 1, rows, columns);
      minefield[i] += check(minefield, x - 1, y - 1, rows, columns);
      minefield[i] += check(minefield, x - 1, y + 1, rows, columns);
    }
  }

  return minefield;
}


function check(array, x, y, rows, columns) {
  if (x < 0 || y < 0 || x >= columns || y >= rows) {
    return 0;
  }

  return array[(y * columns) + x] === '*' ? 1 : 0;
}

function reveal(squares, visibleSquares, x, y, rows, columns) {
  var index = (y * columns) + x;
  if (visibleSquares[index] || x < 0 || y < 0 || x >= columns || y >= rows) {
    return;
  }

  visibleSquares[index] = true;

  if (squares[index] === 0) {
    for (var dx = -1; dx <= 1; dx++) {
      for (var dy = -1; dy <= 1; dy++) {
        reveal(squares, visibleSquares, x + dx, y + dy, rows, columns);
      }
    }
  }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}