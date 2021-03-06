import React, { Component } from "react";

class Board extends Component {
	drop = (e) => {
		e.preventDefault();
		const { shipNumber, shipArea } = JSON.parse(e.dataTransfer.getData("ship-data"));
		try {
			if (!shipNumber || shipNumber === "false") {

				throw new Error(`that's not a ship lol`);
			}
		} catch (e) {
			console.log(e);
			return;
		}

		this.props.placeShip(
			shipNumber,
			Number(e.target.getAttribute("name")),
			this.props.entrantNumber,
			shipArea
		);
	};

	dragOver = (e) => {
		e.preventDefault();
	};

	hit = (e) => {
		// Only works on computer board
		if (this.props.boardHit) {
			this.props.boardHit(
				e.target.getAttribute("name") // index
			);
		}
	};

	render() {
		const cells = this.props.cells;
		const cellsDisplay = cells.map((cell, index) => (
			<div
				className={`cell ${cell.status}`}
				data-value={cell.status}
				name={index}
				key={index}
				data-ship-number={cell.shipNumber}
				data-ship-area={cell.shipArea}
				id={`${this.props.entrantNumber}-${index}`}
				onClick={this.hit}
				onDrop={this.drop}
				onDragOver={this.dragOver}
			>
				{this.props.ship || ""}
			</div>
		));
		return (
			<div className="board" id={`board-${this.props.entrantNumber}`}>
				{cellsDisplay}
			</div>
		);
	}
}

export default Board;
