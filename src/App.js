import React, { Component } from "react";
import Ship from "./Ship";
import "./App.scss";

class App extends Component {
	state = {
    participants: [
      [
        [false, false, false, false, false],
        [false, false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false],
      ],
      [
        [false, false, false, false, false],
        [false, false, false, false],
        [false, false, false],
        [false, false, false],
        [false, false],
      ],
    ]
		
	};


	onShipHit = (status, shipArea, shipNumber, entrantNumber) => {
    entrantNumber = Number(entrantNumber)
    console.log(this.state)
    const currentState = this.state;
    console.log(currentState)
    console.log(status, shipArea, shipNumber, entrantNumber)
		currentState.participants[entrantNumber][shipNumber][shipArea] = true;
		this.setState(currentState);
		this.winCheck(entrantNumber);
	};

	winCheck = (entrantNumber) => {
    const entrantShips = this.state.participants[entrantNumber];
    const falseFound = entrantShips.find(ship => ship.some(part => part === false))
    console.log(falseFound)
    if (!falseFound) {
      this.winCelebration(entrantNumber)
    }
	};

  winCelebration = entrantNumber => {
    const name = Object.keys(this.state.participants[entrantNumber])
    alert(`${name} wins!!!`)
  }

	render() {
		return (
			<div className="App">
				<Ship
					entrant="0"
					shipNumber="0"
					title="Carrier"
          hits={this.state.participants[0][0]}
          sunk={this.state.participants[0][0].some(part => part === false)? false : true}
          onShipHit={this.onShipHit}
				/>
				<Ship
					entrant="0"
					shipNumber="1"
					title="Battleship"
          hits={this.state.participants[0][1]}
          sunk={this.state.participants[0][1].some(part => part === false)? false : true}
          onShipHit={this.onShipHit}
				/>
				<Ship
					entrant="0"
					shipNumber="2"
					title="Destroyer"
          hits={this.state.participants[0][2]}
          sunk={this.state.participants[0][2].some(part => part === false)? false : true}
          onShipHit={this.onShipHit}
				/>
				<Ship
					entrant="0"
					shipNumber="3"
					title="Submarine"
          hits={this.state.participants[0][3]}
          sunk={this.state.participants[0][3].some(part => part === false)? false : true}
          onShipHit={this.onShipHit}
				/>
				<Ship
					entrant="0"
					shipNumber="4"
          title="Patrol"
          hits={this.state.participants[0][4]}
          sunk={this.state.participants[0][4].some(part => part === false)? false : true}
          onShipHit={this.onShipHit}
				/>
			</div>
		);
	}
}

export default App;
