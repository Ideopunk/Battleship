import React, { Component } from "react";
import Ship from "./Ship";
import "./App.css";

class App extends Component {
	state = {
		player: [
			[false, false, false, false, false],
			[false, false, false, false],
			[false, false, false],
			[false, false, false],
			[false, false],
		],
		computer: [
			[false, false, false, false, false],
			[false, false, false, false],
			[false, false, false],
			[false, false, false],
			[false, false],
		],
	};

	onShipHit = (entrant, shipNumber, shipArea) => {
		const currentState = this.state;
		currentState[entrant][shipNumber][shipArea] = true;
		this.setState(currentState);
		this.winCheck(entrant);
	};

	winCheck = (entrant) => {
    const entrantShips = this.state[entrant];
    const falseFound = entrantShips.find(ship => 
      ship.find(part => part === false)
    )
    if (!falseFound) {
      this.winCelebration(entrant)
    }
	};

  winCelebration = entrant => {
    alert(`${entrant} wins!!!`)
  }

	render() {
		return (
			<div className="App">
				<Ship
					entrant="player"
					shipNumber="0"
					title="Carrier"
					hits={this.state.player[0]}
				/>
				<Ship
					entrant="player"
					shipNumber="1"
					title="Battleship"
					hits={this.state.player[1]}
				/>
				<Ship
					entrant="player"
					shipNumber="2"
					title="Destroyer"
					hits={this.state.player[2]}
				/>
				<Ship
					entrant="player"
					shipNumber="3"
					title="Submarine"
					hits={this.state.player[3]}
				/>
				<Ship
					entrant="player"
					shipNumber="4"
					title="Patrol"
					hits={this.state.player[4]}
				/>
			</div>
		);
	}
}

export default App;
