import React, { Component } from 'react';
import './App.css';

const Stars = (props) => {
	return (
  	<div className="col-5">
      {_.range(props.numberOfStars).map(i => 
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
  	<div className="col-2">
      {button}
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

Numbers.list = _.range(1, 10);

class Game extends React.Component {
	state = {
  	selectedNumbers: [],
		randomNumberOfStars: 1 + Math.floor(Math.random()*9),
    usedNumbers: [],
    answerIsCorrect: null,
  }
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
			randomNumberOfStars: 1 + Math.floor(Math.random()*9),
 	  }))
  }
	render() {
  	const {
      selectedNumbers, 
      randomNumberOfStars, 
      answerIsCorrect,
      usedNumbers,
    } = this.state;
    
  	return (
    	<div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />
          <Button selectedNumbers={selectedNumbers}  
                  checkAnswer={this.checkAnswer}
                  acceptAnswer={this.acceptAnswer}
                  answerIsCorrect={answerIsCorrect} />
          <Answer 
            selectedNumbers={selectedNumbers} 
            rollbackNumber={this.rollbackNumber} 
          />
        </div>
        <br />
        <Numbers 
          selectedNumbers={selectedNumbers} 
          selectNumber={this.selectNumber}
          usedNumbers={usedNumbers} />
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

export default App;
