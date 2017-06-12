import React from 'react';
import range from 'lodash.range';
import './App.css';

const Stars = (props) => {
	return (
  	<div className="col-5">
      {range(props.numberOfStars).map(i => 
      	<i key={i} className="fa fa-star"></i>
      )}
    </div>
  )
}

const Button = (props) => {
	let button;
  switch(props.answerIsCorrect) {
  	case true:
      button = 
        <button className="btn btn-success" onClick={props.acceptAnswer}>
          <i className="fa fa-check"></i>
        </button>
    	break;
  	case false:
      button = 
        <button className="btn btn-danger">
          <i className="fa fa-times"></i>
        </button>
    	break;
  	default:
      button = 
        <button className="btn"
                onClick={props.checkAnswer}
                disabled={props.selectedNumbers.length === 0}>
          =
        </button>
    	break;
  }
	return (
  	<div className="col-2 text-center">
      {button}
      <br/><br/>
      <button className="btn btn-warning btn-sm" onClick={props.redraw}
              disabled={props.redraws === 0}>
        <i className="fa fa-refresh"></i> {props.redraws}
      </button>
    </div>
  )
}

const Answer = (props) => {
	return (
  	<div className="col-5">
      {props.selectedNumbers.map((num, i) => 
        <span key={i}
              onClick={() => props.rollbackNumber(num)}>
          {num}
        </span>
      )}
    </div>
  )
}

const DoneFrame = (props) => {
	return (
  	<div className="text-center">
      <h2>{props.doneStatus}</h2>
            <button className="btn btn-secondary" onClick={props.resetGame}>
        Play Again
      </button>
    </div>
  )
}

const Numbers = (props) => { 
	const numberClassName = (number) => {
  	if (props.usedNumbers.includes(number)) 		{ return 'used' }
  	if (props.selectedNumbers.includes(number)) { return 'selected' }
  }
  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((num, i) => 
      		<span key={i} className={numberClassName(num)}
                onClick={() => props.selectNumber(num)}>
            {num}
          </span>
        )}
      </div>
    </div>
  );
};

Numbers.list = range(1, 10);

class Game extends React.Component {
	static randomNumber = () => 1 + Math.floor(Math.random()*9);
  static initialState = () => ({
  	selectedNumbers: [],
		randomNumberOfStars: Game.randomNumber(),
    usedNumbers: [],
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null
  });
	state = Game.initialState();
    
  resetGame = () => this.setState(Game.initialState());
  
  selectNumber = (clickedNumber) => {
    if (this.state.selectedNumbers.includes(clickedNumber) !== false) { return; }
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }))
  }
  rollbackNumber = (clickedNumber) => {
  	this.setState(prevState => ({
   	  answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.filter(n => n !== clickedNumber)
    }))
  }
  checkAnswer = ()  => {
  	this.setState(prevState => ({
    	answerIsCorrect: prevState.randomNumberOfStars ===
      	prevState.selectedNumbers.reduce((acc, curr) => acc + curr, 0)
    }))
  }
  acceptAnswer = () => {
    this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
			randomNumberOfStars: Game.randomNumber(),
 	  }), this.updateDoneStatus)
  }
  redraw = () => {
  	if (this.state.redraws === 0) return;
    this.setState(prevState => ({
			randomNumberOfStars: Game.randomNumber(),
      answerIsCorrect: null,
      selectedNumbers: [],
      redraws: prevState.redraws - 1
 	  }), this.updateDoneStatus)
  }
  
  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
    const possibleNumbers = range(1, 10).filter(number =>
      usedNumbers.indexOf(number) === -1
    );

    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  };
  
  updateDoneStatus = () => {
    this.setState(prevState => {
			if (prevState.usedNumbers.length === 9) {
      	return {doneStatus: "Done. Hurray!"}
      }
      if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
      	return {doneStatus: "Game Over!"}
      }
 	  });
  }
  
	render() {
  	const {
      selectedNumbers, 
      randomNumberOfStars, 
      answerIsCorrect,
      usedNumbers,
      redraws,
      doneStatus,
    } = this.state;
    
  	return (
    	<div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />
          <Button selectedNumbers={selectedNumbers}  
                  checkAnswer={this.checkAnswer}
                  redraw={this.redraw}
                  acceptAnswer={this.acceptAnswer}
                  answerIsCorrect={answerIsCorrect} 
                  redraws={redraws}/>
          <Answer 
            selectedNumbers={selectedNumbers} 
            rollbackNumber={this.rollbackNumber} 
          />
        </div>
        <br />
        {doneStatus ?
          <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus} /> :
          <Numbers selectedNumbers={selectedNumbers}
                   selectNumber={this.selectNumber}
                   usedNumbers={usedNumbers} />
        }
      </div>
    )
  }
}

class App extends React.Component {
	render() {
  	return (
    	<div>
        <Game />
      </div>
    )
  }
}

// Algorithm to determine the possible combinations left that match the number of stars.
// Taken from: bit.ly/s-pcs
const possibleCombinationSum = (arr, n) => {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  const listSize = arr.length, combinationsCount = (1 << listSize)
  for (let i = 1; i < combinationsCount ; i++ ) {
    let combinationSum = 0;
    for (let j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

export default App;
