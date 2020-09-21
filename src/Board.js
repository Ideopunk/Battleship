import React, { Component } from "react";

class Board extends Component {
	drop = (e) => {
        e.preventDefault();
        console.log(e.dataTransfer)
		const shipName = e.dataTransfer.getData("id");
		const shipArea = e.dataTransfer.getData("shipArea");
		const ship = document.getElementById(shipName);
        ship.style.display = "block";
        
		e.target.appendChild(ship);
	};

    dragOver = e => {
        e.preventDefault();
    }

	hit = (e) => {
		this.props.onBoardHit(
			e.target.getAttribute("data-value"),
			e.target.getAttribute("name"), // index
			this.props.entrantNumber
		);
	};

	render() {
		const cells = this.props.cells;
		const cellsDisplay = cells.map((cell, index) => (
			<div
				className={`cell ${cell}`}
				data-value={cell}
				name={index}
                key={index}
                id={`${this.props.entrantNumber}-${index}`}
				onClick={this.hit}
                onDrop={this.drop}
                onDragOver={this.dragOver}
			>
				{this.props.ship || ""}
			</div>
		));
		return <div className="board">{cellsDisplay}</div>;
	}
}

export default Board;
