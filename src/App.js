import React, { Component } from "react";
import Ship from "./Ship";
import Board from "./Board";
import Announcements from "./Announcements";
import "./style/App.scss";
import * as computer from "./computer";

class App extends Component {
	initialState = {
		participants: [
			{
				ships: [
					{ parts: [false, false, false, false, false], onBoard: false, name: "Carrier"},
					{ parts: [false, false, false, false], onBoard: false, name: "Battleship" },
					{ parts: [false, false, false], onBoard: false, name: "Destroyer"},
					{ parts: [false, false, false], onBoard: false, name: "Submarine" },
					{ parts: [false, false], onBoard: false, name: "Patrol" },
				],
				board: new Array(100).fill({
					status: "naw",
					shipNumber: undefined,
					shipArea: undefined,
				}),
			},
			{
				ships: [
					{ parts: [false, false, false, false, false], onBoard: false, name: "Carrier" },
					{ parts: [false, false, false, false], onBoard: false, name: "Battleship" },
					{ parts: [false, false, false], onBoard: false, name: "Destroyer"},
					{ parts: [false, false, false], onBoard: false, name: "Submarine" },
					{ parts: [false, false], onBoard: false, name: "Patrol" },
				],
				board: new Array(100).fill({
					status: "naw",
					shipNumber: undefined,
					shipArea: undefined,
				}),
			},
		],
		orientation: "horizontal",
		gamestart: false,
		message: ["Drag or randomize to begin..."],
		lastCompAttack: {
			status: "miss",
			coordinate: 0,
		},
	};

	state = JSON.parse(JSON.stringify(this.initialState));

	// SHIP PLACEMENT STUFF

	// Computer ship placement
	randomize = () => {
		if (!this.state.gamestart) {
			this.placeRandomShips(0);
			this.startCheck();
		}
	};

	placeRandomShip = (shipNumber, entrantNumber) => {
		const ship = this.state.participants[entrantNumber].ships[shipNumber];
		const length = ship.parts.length;
		const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
		const multiplier = orientation === "horizontal" ? 1 : 10;
		const cellIndex = computer.boardpoint(length, orientation);

		let cellArray = [];

		for (let i = 0; i < length; i++) {
			let newCellIndex = cellIndex + i * multiplier;
			if (this.state.participants[entrantNumber].board[newCellIndex].status === "ship") {
				cellArray = [];
				break;
			}
			cellArray.push(cellIndex + i * multiplier);
		}

		return cellArray;
	};

	placeRandomShips = (entrantNumber) => {
		for (let i = 0; i < 5; i++) {
			if (!this.state.participants[entrantNumber].ships[i].onBoard) {
				let cellArray = [];
				while (cellArray.length < 1) {
					cellArray = this.placeRandomShip(i, entrantNumber);
				}
				this.distributeShip(cellArray, i, entrantNumber);
			}
		}
	};

	// human ship placement
	placeShip = (shipNumber, cellIndex, entrantNumber, shipArea) => {
		let cellArray = [];
		let transitionCellIndex;

		const ship = this.state.participants[entrantNumber].ships[shipNumber];
		const shipLength = ship.parts.length;
		const orientation = this.state.orientation;

		let multiplier = orientation === "horizontal" ? 1 : 10;
		// move the ship depending on which part of the ship the player is dragging.
		transitionCellIndex = cellIndex - shipArea * multiplier;

		try {
			for (let i = 0; i < shipLength; i++) {
				let newCellIndex = transitionCellIndex + i * multiplier;
				if (newCellIndex > 99) {
					throw new Error("yr off the board");
				}
				if (i > 0 && newCellIndex % 10 === 0) {
					throw new Error("yr off the board");
				}
				if (this.state.participants[entrantNumber].board[newCellIndex].status === "ship") {
					throw new Error("yr on another ship bud");
				}
				cellArray.push(transitionCellIndex + i * multiplier);
			}
		} catch (e) {
			console.log(e);
			return;
		}

		this.distributeShip(cellArray, shipNumber, entrantNumber);
		this.startCheck();
	};

	distributeShip = (cellArray, shipNumber, entrantNumber) => {
		for (let [index, cell] of cellArray.entries()) {
			this.boardStateUpdate(cell, entrantNumber, shipNumber, index);
		}
	};

	boardStateUpdate = (boardArrayIndex, entrantNumber, shipNumber, shipArea) => {
		let currentState = this.state;

		currentState.participants[entrantNumber].ships[shipNumber].onBoard = true;
		currentState.participants[entrantNumber].board[boardArrayIndex].status = "ship";
		currentState.participants[entrantNumber].board[boardArrayIndex].shipArea = shipArea;
		currentState.participants[entrantNumber].board[boardArrayIndex].shipNumber = shipNumber;
		this.setState(currentState);
	};

	// TURN STUFF
	startCheck() {
		if (!this.state.participants[0].ships.some((ship) => ship.onBoard === false)) {
			let currentState = this.state;
			currentState.gamestart = true;
			this.messageUpdate("The game begins!");
			this.setState(currentState);
			this.placeRandomShips(1);
		}
	}

	playerTurnEnd = (status, boardIndex) => {
		try {
			if (status !== "naw" && status !== "ship") {
				throw new Error(`you can't click there`);
			}
		} catch (e) {
			console.log(e);
			return;
		}

		let end = this.onBoardHit(status, boardIndex, 1);
		try {
			if (!end) {
				throw new Error("It's over!");
			}
		} catch (e) {
			console.log(e);
			return;
		}

		console.log(this.state.gamestart);

		console.log(this.state.gamestart);
		// get a good hit from the computer
		let computerAttackIndex = computer.attack(this.state.lastCompAttack);
		console.log(computerAttackIndex);
		let computerStatus = this.state.participants[0].board[computerAttackIndex].status;
		while (
			this.state.participants[0].board[computerAttackIndex].status !== "ship" &&
			this.state.participants[0].board[computerAttackIndex].status !== "naw"
		) {
			computerAttackIndex = computer.attack(this.state.lastCompAttack);
			console.log(computerAttackIndex);
			computerStatus = this.state.participants[0].board[computerAttackIndex].status;
		}

		end = this.onBoardHit(computerStatus, computerAttackIndex, 0);
		try {
			if (!end) {
				throw new Error("It's over!");
			}
		} catch (e) {
			console.log(e);
			return;
		}
	};

	onBoardHit = (status, boardIndex, entrantNumber) => {
		const currentState = this.state;
		if (status === "naw") {
			currentState.participants[entrantNumber].board[boardIndex].status = "miss";
			if (entrantNumber) {
				this.messageUpdate("Your attack misses!");
			} else {
				currentState.lastCompAttack = { status: "miss", coordinate: boardIndex };
				this.messageUpdate("The computer's attack misses!");
			}
			return true;
		} else if (status === "ship") {
			currentState.participants[entrantNumber].board[boardIndex].status = "hit";
			if (entrantNumber) {
				this.messageUpdate("Your attack hits!");
			} else {
				currentState.lastCompAttack = { status: "hit", coordinate: boardIndex };
				this.messageUpdate("The computer's attack hits!");
			}

			// extract ship area from doc
			const ID = `${entrantNumber}-${boardIndex}`;
			const cell = document.getElementById(ID);
			const shipArea = cell.getAttribute("data-ship-area");
			const shipNumber = cell.getAttribute("data-ship-number");
			this.setState(currentState);
			const end = this.onShipHit(shipArea, shipNumber, entrantNumber);
			return end;
		}
	};

	onShipHit = (shipArea, shipNumber, entrantNumber) => {
		console.log("onshiphit!");
		let currentState = this.state;

		currentState.participants[entrantNumber].ships[shipNumber].parts[shipArea] = true;
		if (
			!currentState.participants[entrantNumber].ships[shipNumber].parts.some(
				(part) => part === false
			)
		) {
			if (!entrantNumber) {
				this.messageUpdate(`Your ${currentState.participants[entrantNumber].ships[shipNumber].name.toLowerCase()} has sunk!`);
			} else {
				this.messageUpdate(`The computer's ${currentState.participants[entrantNumber].ships[shipNumber].name.toLowerCase()} has sunk!`);
			}
		}
		console.log(currentState);
		this.setState(currentState);
		const end = this.winCheck(entrantNumber);
		return end;
	};

	winCheck = (entrantNumber) => {
		let otherEntrantNumber;
		if (entrantNumber === 0) {
			otherEntrantNumber = 1;
		} else {
			otherEntrantNumber = 0;
		}
		console.log(otherEntrantNumber);
		const entrantShips = this.state.participants[entrantNumber].ships;
		const falseFound = entrantShips.find((ship) => ship.parts.some((part) => part === false));
		console.log(this.state);

		if (!falseFound) {
			const end = this.winCelebration(otherEntrantNumber);
			return end;
		}
		return true;
	};

	winCelebration = (entrantNumber) => {
		console.log(this.state.gamestart);

		const end = this.reset(entrantNumber);
		return end;
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

	reset = (entrantNumber) => {
		console.log(this.initialState);
		let currentState = JSON.parse(JSON.stringify(this.initialState)); 
		if (entrantNumber === 0) {
			currentState.message = ["You win! You're a hero!"]
		} else if (entrantNumber === 1) {
			currentState.message = ["You lose! The computer is so smart!"]
		}
		this.setState(currentState)
		// this.setState(JSON.parse(JSON.stringify(this.initialState)));
		// if (entrantNumber === 0) {
		// 	this.messageUpdate("You win! Ur sick!");
		// } else if (entrantNumber === 1) {
		// 	this.messageUpdate("you lose! The computer is so smart!");
		// }
		return undefined;
	};

	messageUpdate = (newMessage) => {
		const currentState = this.state;
		currentState.message.push(newMessage);
		if (currentState.message.length > 12) {
			currentState.message.shift();
		}
		this.setState(currentState);
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

		const ship = (entrantNumber, shipNumber) => (
			<Ship
				entrant={entrantNumber}
				shipNumber={shipNumber}
				title={this.state.participants[entrantNumber].ships[shipNumber].name}
				orientation={this.state.orientation}
				board={this.state.participants[entrantNumber].board}
				onBoard={this.state.participants[entrantNumber].ships[shipNumber].onBoard}
				draggable={
					entrantNumber
						? false
						: !this.state.participants[entrantNumber].ships[shipNumber].onBoard
				}
				hits={this.state.participants[entrantNumber].ships[shipNumber]}
				sunk={
					this.state.participants[entrantNumber].ships[shipNumber].parts.some(
						(part) => part === false
					)
						? false
						: true
				}
				onShipHit={this.onShipHit}
			/>
		);

		return (
			<div className="App">

				<div className="boards">
					<div>
						<h2 className="board-header">{this.state.gamestart? "Your board" : "Set up your board"}</h2>
						{board(0, null)}
						<div className="entrant-pieces">
							{ship(0, 0)}
							{ship(0, 1)}
							{ship(0, 2)}
							{ship(0, 3)}
							{ship(0, 4)}
						</div>
					</div>
					<div>
						<h2 className="board-header">Opponent's board</h2>
						{board(1, (this.state.gamestart ? this.playerTurnEnd : null))}
						<div className="entrant-pieces">
							{ship(1, 0)}
							{ship(1, 1)}
							{ship(1, 2)}
							{ship(1, 3)}
							{ship(1, 4)}
						</div>
					</div>
					<div>
						<Announcements message={this.state.message} />
						<div className="commands">
							<button onClick={this.randomize}>Randomize</button>
							<button onClick={this.changeOrientation}>Change ship orientation</button>
							<button onClick={() => this.reset(-1)}>Reset</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
