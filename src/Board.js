import React, { Component } from "react";

class Board extends Component {

    // separate this until drop function is just giving a shipID and e.target.getAttribute(name) and passing them to the next function.
	drop = (e) => {
        e.preventDefault();
        const shipID = e.dataTransfer.getData("id");
        console.log(this.props.entrantNumber)
        this.props.placeShip(shipID, Number(e.target.getAttribute("name")), this.props.entrantNumber)
	};

	dragOver = (e) => {
		e.preventDefault();
	};

	hit = (e) => {
        // Only works on computer board
        if (this.props.boardHit) {
            this.props.boardHit(
                e.target.getAttribute("data-value"),
                e.target.getAttribute("name"), // index
            ) 
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
                data-ship-name={cell.shipName}
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
