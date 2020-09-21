import React, { Component } from "react";
import Ship from "./Ship";
import Board from "./Board";
import "./App.scss";

class App extends Component {
	initialState = {
		participants: [
			{
				ships: [
					[false, false, false, false, false],
					[false, false, false, false],
					[false, false, false],
					[false, false, false],
					[false, false],
				],
				board: new Array(100).fill("naw"),
			},
			{
				ships: [
					[false, false, false, false, false],
					[false, false, false, false],
					[false, false, false],
					[false, false, false],
					[false, false],
				],
				board: new Array(100).fill("naw"),
			},
		],
		orientation: "vertical",
	};

	state = {
		participants: [
			{
				ships: [
					[false, false, false, false, false],
					[false, false, false, false],
					[false, false, false],
					[false, false, false],
					[false, false],
				],
				board: new Array(100).fill("naw"),
			},
			{
				ships: [
					[false, false, false, false, false],
					[false, false, false, false],
					[false, false, false],
					[false, false, false],
					[false, false],
				],
				board: new Array(100).fill("naw"),
			},
		],
		orientation: "horizontal",
	};

	onBoardHit = (status, boardIndex, shipName, shipArea, entrantNumber) => {
		const currentState = this.state;
		if (status === "naw") {
			currentState.participants[entrantNumber].board[boardIndex] = "miss";
		} else if (status === "ship") {
			currentState.participants[entrantNumber].board[boardIndex] = "hit";
			this.onShipHit(shipArea, boardIndex, entrantNumber);
		}

		this.setState(currentState);
		return;
	};

	onShipHit = (shipArea, shipNumber, entrantNumber) => {
		entrantNumber = Number(entrantNumber);
		const currentState = this.state;
		currentState.participants[entrantNumber].ships[shipNumber][
			shipArea
		] = true;
		this.setState(currentState);
		this.winCheck(entrantNumber);
	};

	winCheck = (entrantNumber) => {
		const entrantShips = this.state.participants[entrantNumber].ships;
		const falseFound = entrantShips.find((ship) =>
			ship.some((part) => part === false)
		);
		if (!falseFound) {
			this.winCelebration(entrantNumber);
		}
	};

	winCelebration = (entrantNumber) => {
		if (entrantNumber === 0) {
			alert(`You win!!!`);
		} else {
			alert(`Computer wins!!`);
		}
		this.setState(this.initialState);
	};

  changeOrientation = () => {
    let newOrientation;
    if (this.state.orientation === "horizontal") {
      newOrientation = "vertical"
    } else {
      newOrientation = "horizontal"
    }
    this.setState({
      orientation: newOrientation
    })
  }

	render() {
		return (
			<div className="App">
				<div className="boards">
					<Board
						entrantNumber="0"
						cells={this.state.participants[0].board}
						onBoardHit={this.onBoardHit}
					/>
				</div>
				<div className="pieces">
					<Ship
						entrant="0"
						shipNumber="0"
            title="Carrier"
            orientation={this.state.orientation}
						hits={this.state.participants[0].ships[0]}
						sunk={
							this.state.participants[0].ships[0].some(
								(part) => part === false
							)
								? false
								: true
						}
						onShipHit={this.onShipHit}
					/>
					<Ship
						entrant="0"
						shipNumber="1"
						title="Battleship"
            orientation={this.state.orientation}
						hits={this.state.participants[0].ships[1]}
						sunk={
							this.state.participants[0].ships[1].some(
								(part) => part === false
							)
								? false
								: true
						}
						onShipHit={this.onShipHit}
					/>
					<Ship
						entrant="0"
						shipNumber="2"
						title="Destroyer"
            orientation={this.state.orientation}
						hits={this.state.participants[0].ships[2]}
						sunk={
							this.state.participants[0].ships[2].some(
								(part) => part === false
							)
								? false
								: true
						}
						onShipHit={this.onShipHit}
					/>
					<Ship
						entrant="0"
						shipNumber="3"
						title="Submarine"
            orientation={this.state.orientation}
						hits={this.state.participants[0].ships[3]}
						sunk={
							this.state.participants[0].ships[3].some(
								(part) => part === false
							)
								? false
								: true
						}
						onShipHit={this.onShipHit}
					/>
					<Ship
						entrant="0"
						shipNumber="4"
						title="Patrol"
            orientation={this.state.orientation}
						hits={this.state.participants[0].ships[4]}
						sunk={
							this.state.participants[0].ships[4].some(
								(part) => part === false
							)
								? false
								: true
						}
						onShipHit={this.onShipHit}
					/>
				</div>
			</div>
		);
	}
}

export default App;
