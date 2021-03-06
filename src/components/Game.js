import React from 'react';
import range from 'lodash.range';
import Stars from './Stars';
import DoneFrame from './DoneFrame';
import Button from './Button';
import Numbers from './Numbers';
import Answer from './Answer';


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

export default Game;