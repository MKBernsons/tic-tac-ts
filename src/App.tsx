import React from 'react';
import './App.css';

type SquareType = {
  value: string,
  onClick: () => void
}

function Square(props: SquareType) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

type Squares = {
  squares: string[]
}

type BoardType = {
  squares: string[],
  onClick: (i: number) => void
}

class Board extends React.Component<BoardType> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i].toString()}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {
          this.props.squares.map((square, index) => {
            if (index % 3 === 0) {
              return (
                <div className="board-row">
                  {this.renderSquare(index)}
                  {this.renderSquare(index + 1)}
                  {this.renderSquare(index + 2)}
                </div>
              );
            }
          })
        }
      </div>
    )
  }
}

interface IGame {
  history?: Squares[],
  stepNumber?: number,
  xIsNext?: boolean,
  moves: [col: number, row: number][]  
}

type GameState = {
  history: Squares[],
  stepNumber: number,
  xIsNext: boolean,
  moves: Move[],
}

interface Move {
  col: number,
  row: number
}

class Game extends React.Component<IGame, GameState> {
  constructor(props: IGame) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill('')
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      moves: Array(9).fill([0, 0])
    };
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });

    this.state.moves[history.length] = {
      col: this.getCol(i),
      row: this.getRow(i)
    }
  }

  getCol(i: number): number {
    if(i === 0 || i === 3 || i === 6) return 1;
    else if(i === 1 || i === 4 || i === 7) return 2;
    else return 3;
  }

  getRow(i: number): number {
    if(i < 3) return 1;
    else if(i < 6) return 2;
    else return 3;
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history!.map((step, move) => {
      const desc = move ?
        '#' + move + ' Col-' + this.state.moves[move].col + ' Row-' + this.state.moves[move].row:
        'Go to game start';
        if(move === this.state.stepNumber){
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button>
            </li>
          );
        }
        else{
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
        }
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


function App() {
  return (
    <div className="App">
      <Game
        history={[]}
        stepNumber={0}
        xIsNext={false}
        moves={[]}
      />
    </div>
  );
}

export default App;


function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}