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
					{ parts: [false, false, false, false, false], onBoard: false },
					{ parts: [false, false, false, false], onBoard: false },
					{ parts: [false, false, false], onBoard: false },
					{ parts: [false, false, false], onBoard: false },
					{ parts: [false, false], onBoard: false },
				],
				board: new Array(100).fill({
					status: "naw",
					shipNumber: undefined,
					shipArea: undefined,
				}),
			},
			{
				ships: [
					{ parts: [false, false, false, false, false], onBoard: false },
					{ parts: [false, false, false, false], onBoard: false },
					{ parts: [false, false, false], onBoard: false },
					{ parts: [false, false, false], onBoard: false },
					{ parts: [false, false], onBoard: false },
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
		message: ["Pre-game nerves"],
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
		console.log(shipNumber, entrantNumber);
		const ship = this.state.participants[entrantNumber].ships[shipNumber];
		const length = ship.parts.length;
		const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
		const multiplier = orientation === "horizontal" ? 1 : 10;
		const cellIndex = computer.boardpoint(length, orientation);
		console.log(ship, length, orientation, multiplier, cellIndex);

		let cellArray = [];

		for (let i = 0; i < length; i++) {
			let newCellIndex = cellIndex + i * multiplier;
			if (this.state.participants[entrantNumber].board[newCellIndex].status === "ship") {
				cellArray = [];
				break;
			}
			cellArray.push(cellIndex + i * multiplier);
		}

		console.log(cellArray);
		return cellArray;
	};

	placeRandomShips = (entrantNumber) => {
		for (let i = 0; i < 5; i++) {
			let cellArray = [];
			while (cellArray.length < 1) {
				cellArray = this.placeRandomShip(i, entrantNumber);
			}
			this.distributeShip(cellArray, i, entrantNumber);
		}
	};

	// human ship placement
	placeShip = (shipNumber, cellIndex, entrantNumber) => {
		const ship = this.state.participants[0].ships[shipNumber];
		const shipLength = ship.parts.length;
		const orientation = this.state.orientation;
		let cellArray = [];
		let multiplier = orientation === "horizontal" ? 1 : 10;
		try {
			for (let i = 0; i < shipLength; i++) {
				let newCellIndex = cellIndex + i * multiplier;
				if (newCellIndex > 99) {
					throw new Error("yr off the board");
				}
				if (i > 0 && newCellIndex % 10 === 0) {
					throw new Error("yr off the board");
				}
				if (this.state.participants[entrantNumber].board[newCellIndex].status === "ship") {
					throw new Error("yr on another ship bud");
				}
				cellArray.push(cellIndex + i * multiplier);
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
		console.log("start check");
		if (!this.state.participants[0].ships.some((ship) => ship.onBoard === false)) {
			console.log("ready to start");
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

		this.onBoardHit(status, boardIndex, 1);

		// get a good hit from the computer
		console.log(this.state.lastCompAttack);
		let computerAttackIndex = computer.attack(this.state.lastCompAttack);
		let computerStatus = this.state.participants[0].board[computerAttackIndex].status;
		while (
			this.state.participants[0].board[computerAttackIndex].status !== "ship" &&
			this.state.participants[0].board[computerAttackIndex].status !== "naw"
		) {
			computerAttackIndex = computer.attack(this.state.lastCompAttack);
			console.log(computerAttackIndex);
			computerStatus = this.state.participants[0].board[computerAttackIndex].status;
		}

		this.onBoardHit(computerStatus, computerAttackIndex, 0);
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
			this.onShipHit(shipArea, shipNumber, entrantNumber);
		}

		this.setState(currentState);
		return;
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
				this.messageUpdate("Your ship has sunk!");
			} else {
				this.messageUpdate("The computer's ship has sunk!");
			}
		}
		console.log(currentState);
		this.setState(currentState);
		this.winCheck(entrantNumber);
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
			this.winCelebration(otherEntrantNumber);
		}
	};

	winCelebration = (entrantNumber) => {
		this.reset();
		if (entrantNumber === 0) {
			console.log("u win");
			this.messageUpdate("You win! Ur sick!");
		} else {
			console.log("u lose");
			this.messageUpdate("you lose! The computer is so smart!");
		}
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

	reset = () => {
		this.setState(JSON.parse(JSON.stringify(this.initialState)));
	};

	messageUpdate = (newMessage) => {
		const currentState = this.state;
		currentState.message.push(newMessage);
		if (currentState.message.length > 20) {
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

		const ship = (entrantNumber, shipNumber, title) => (
			<Ship
				entrant={entrantNumber}
				shipNumber={shipNumber}
				title={title}
				orientation={this.state.orientation}
				board={this.state.participants[entrantNumber].board}
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
				<div className="commands">
					<button onClick={this.randomize}>Randomize</button>
					<button onClick={this.changeOrientation}>Change ship orientation</button>
					<button onClick={this.reset}>Reset</button>
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
					<Announcements message={this.state.message} />
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
