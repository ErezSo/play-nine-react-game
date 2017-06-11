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
	return (
  	<div className="col-2">
      <button className="btn" disabled={props.selectedNumbers.length === 0}>
        =
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

const Numbers = (props) => { 
	const numberClassName = (number) => {
  	return props.selectedNumbers.includes(number) ? 'selected' : '';
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
		randomNumberOfStars: 1 + Math.floor(Math.random()*9)
  }
  selectNumber = (clickedNumber) => {
    if (this.state.selectedNumbers.includes(clickedNumber) !== false) { return; }
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }))
  }
  rollbackNumber = (clickedNumber) => {
  	this.setState(prevState => ({
    	selectedNumbers: prevState.selectedNumbers.filter(n => n !== clickedNumber)
    }))
  }
	render() {
  	const {selectedNumbers, randomNumberOfStars} = this.state;
  	return (
    	<div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />
          <Button selectedNumbers={selectedNumbers}  />
          <Answer 
            selectedNumbers={selectedNumbers} 
            rollbackNumber={this.rollbackNumber} 
          />
        </div>
        <br />
        <Numbers 
          selectedNumbers={selectedNumbers} 
          selectNumber={this.selectNumber}
        />
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
