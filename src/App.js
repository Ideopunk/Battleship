import React, { Component } from "react";
import Ship from "./Ship";
import Board from "./Board";
import "./App.scss";
import * as computer from "./computer";

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
		orientation: "horizontal",
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

	onShipPlacement = (boardArrayIndex, entrantNumber) => {
    let currentState = this.state
    console.log(boardArrayIndex, entrantNumber)
    currentState.participants[entrantNumber].board[boardArrayIndex] = "ship"
    this.setState(currentState)
  };

	playerTurnEnd = (status, boardIndex) => {
    try {
      if (status !== "miss" && status !== "hit") {
        throw new Error(`ya can't click there`)
      }
    } catch(e) {
      console.log(`You can't click there!!`)
    }

    this.onBoardHit(status, boardIndex, 0);

    // get a good hit from the computer
    let computerAttackIndex, computerStatus;
    while (this.state.participants[0].board[computerAttackIndex] !== "ship" || "naw") {
      computerAttackIndex = computer.attack()
      computerStatus = this.state.participants[0].board[computerAttackIndex]
    }
    
    console.log(computerAttackIndex)

    this.onBoardHit(computerStatus,computerAttackIndex,1)
	};

	onBoardHit = (status, boardIndex, entrantNumber) => {
		const currentState = this.state;
		if (status === "naw") {
			currentState.participants[entrantNumber].board[boardIndex] = "miss";
		} else if (status === "ship") {
      currentState.participants[entrantNumber].board[boardIndex] = "hit";

      // extract ship area from doc
      const ID = `${entrantNumber}-${boardIndex}`
      const cell = document.getElementById(ID)
      const shipArea = cell.getAttribute('data-ship-area')
			this.onShipHit(shipArea, boardIndex, entrantNumber);
		}

		this.setState(currentState);
		return;
	};

	onShipHit = (shipArea, shipNumber, entrantNumber) => {
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
			newOrientation = "vertical";
		} else {
			newOrientation = "horizontal";
		}
		this.setState({
			orientation: newOrientation,
		});
	};

	render() {
		return (
			<div className="App">
				<div className="boards">
					<div>
						<h2>Set up your board</h2>
						<Board
							entrantNumber="0"
							cells={this.state.participants[0].board}
							onShipPlacement={this.onShipPlacement}
						/>
					</div>
					<div>
						<h2>Opponent board</h2>
						<Board
							entrantNumber="1"
							cells={this.state.participants[1].board}
							boardHit={this.playerTurnEnd}
							onShipPlacement={this.onShipPlacement}
						/>
					</div>
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
