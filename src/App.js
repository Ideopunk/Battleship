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

	// SHIP PLACEMENT STUFF

	computerPlaceShip = (shipID) => {
    const ship = document.getElementById(shipID);
		const length = ship.childElementCount;
		const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
    const multiplier = orientation === "horizontal" ? 1 : 10;
		const cellIndex = computer.boardpoint(length, orientation);
    
		let cellArray = [];

		for (let i = 0; i < length; i++) {
			let newCellIndex = cellIndex + i * multiplier;
			if (this.state.participants[1].board[newCellIndex] === "ship") {
				cellArray = [];
				break;
			}
			cellArray.push(cellIndex + i * multiplier);
		}

		return cellArray;
	};

	computerPlaceShips = () => {
		const names = [
			"Carrier",
			"Battleship",
			"Destroyer",
			"Submarine",
			"Patrol",
		];
		const compNames = names.map((name) => `1-${name}`);
		for (let compName of compNames) {
			let cellArray = [];
			while (cellArray.length < 1) {
				cellArray = this.computerPlaceShip(compName);
			}
			this.distributeShip(cellArray, compName, 1);
		}
	};

	placeShip = (shipID, cellIndex, entrantNumber) => {
		console.log(shipID, cellIndex, entrantNumber);
		const ship = document.getElementById(shipID);
		const shipLength = ship.childElementCount;
		const orientation = ship.getAttribute("data-orientation");
		let cellArray = [];
		let multiplier = orientation === "horizontal" ? 1 : 10;
		try {
			for (let i = 0; i < shipLength; i++) {
				let newCellIndex = cellIndex + i * multiplier;
				if (newCellIndex > 99) {
					throw new Error("yr off the board");
				} else if (
					this.state.participants[entrantNumber].board[
						newCellIndex
					] === "ship"
				) {
					throw new Error("yr on another ship bud");
				}
				cellArray.push(cellIndex + i * multiplier);
			}
		} catch (e) {
			console.log(e);
			return;
		}

		this.distributeShip(cellArray, shipID, entrantNumber);
	};

	distributeShip = (cellArray, shipID, entrantNumber) => {
		const boardID = `board-${entrantNumber}`;
		const board = document.getElementById(boardID);
		for (let [index, cell] of cellArray.entries()) {
			this.boardStateUpdate(cell, entrantNumber);
			board.childNodes[cell].setAttribute("data-ship-name", shipID);
			board.childNodes[cell].setAttribute("data-ship-area", index);
		}
	};

	boardStateUpdate = (boardArrayIndex, entrantNumber) => {
		let currentState = this.state;
		console.log(boardArrayIndex, entrantNumber);
		currentState.participants[entrantNumber].board[boardArrayIndex] =
			"ship";
		this.setState(currentState);
	};

	// TURN STUFF

	playerTurnEnd = (status, boardIndex) => {
		try {
			if (status !== "naw" && status !== "ship") {
				throw new Error(`you can't click there`);
			}
		} catch (e) {
			console.log(e);
			return;
		}

		this.onBoardHit(status, boardIndex, 1);

		// get a good hit from the computer
		let computerAttackIndex, computerStatus;
		while (
			this.state.participants[0].board[computerAttackIndex] !== "ship" &&
			this.state.participants[0].board[computerAttackIndex] !== "naw"
		) {
			computerAttackIndex = computer.attack();
			computerStatus = this.state.participants[0].board[
				computerAttackIndex
			];
		}

		this.onBoardHit(computerStatus, computerAttackIndex, 0);
	};

	onBoardHit = (status, boardIndex, entrantNumber) => {
		const currentState = this.state;
		if (status === "naw") {
			currentState.participants[entrantNumber].board[boardIndex] = "miss";
		} else if (status === "ship") {
			currentState.participants[entrantNumber].board[boardIndex] = "hit";

			// extract ship area from doc
			const ID = `${entrantNumber}-${boardIndex}`;
			const cell = document.getElementById(ID);
			const shipArea = cell.getAttribute("data-ship-area");
			this.onShipHit(shipArea, boardIndex, entrantNumber);
		}

		this.setState(currentState);
		return;
	};

	onShipHit = (shipArea, shipNumber, entrantNumber) => {
		const currentState = this.state;
		console.log(this.state);
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
		const board = (entrantNumber, boardHit) => (
			<Board
				entrantNumber={entrantNumber}
				placeShip={this.placeShip}
				cells={this.state.participants[entrantNumber].board}
				boardHit={boardHit}
				onShipPlacement={this.onShipPlacement}
			/>
		);

		const ship = (entrantNumber, shipNumber, title) => (
			<Ship
				entrant={entrantNumber}
				shipNumber={shipNumber}
				title={title}
				orientation={this.state.orientation}
				hits={this.state.participants[entrantNumber].ships[shipNumber]}
				sunk={
					this.state.participants[entrantNumber].ships[
						shipNumber
					].some((part) => part === false)
						? false
						: true
				}
				onShipHit={this.onShipHit}
			/>
		);

		return (
			<div className="App">
				<div className="commands">
					<button onClick={this.changeOrientation}>
						Change ship orientation
					</button>
          <button onClick={this.computerPlaceShips}>
						Place computer ships
					</button>
				</div>
				<div className="boards">
					<div>
						<h2>Set up your board</h2>
						{board(0, null)}
					</div>
					<div>
						<h2>Opponent board</h2>
						{board(1, this.playerTurnEnd)}
					</div>
				</div>

				<div className="pieces">
					<div className="entrant-pieces">
						{ship(0, 0, "Carrier")}
						{ship(0, 1, "Battleship")}
						{ship(0, 2, "Destroyer")}
						{ship(0, 3, "Submarine")}
						{ship(0, 4, "Patrol")}
					</div>
					<div className="entrant-pieces">
						{ship(1, 0, "Carrier")}
						{ship(1, 1, "Battleship")}
						{ship(1, 2, "Destroyer")}
						{ship(1, 3, "Submarine")}
						{ship(1, 4, "Patrol")}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
