import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Game extends Component {
	render() {
  	return (
    	<div>
        <h3>Play Nine</h3>
      </div>
    )
  }
}

class App extends Component {
	render() {
  	return (
    	<div>
        <Game />
      </div>
    )
  }
}

export default App;
