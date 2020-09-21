import React, { Component } from "react";

class Board extends Component {
	drop = (e) => {
        console.log(e.target)
        e.preventDefault();
        console.log(e.dataTransfer)
        const shipID = e.dataTransfer.getData("id");
        const ship = document.getElementById(shipID)
        const shipArea = ship.getAttribute('data-value')
        
        e.target.classList.remove('naw')
        e.target.classList.add('ship-cell')
        e.target.setAttribute("data-value", "ship")
        e.target.setAttribute("data-ship-name", shipID)
        e.target.setAttribute("data-ship-area", shipArea)
	};

    dragOver = e => {
        e.preventDefault();
    }

	hit = (e) => {
        console.log(
            e.target.getAttribute("data-value"),
			e.target.getAttribute("name"), // index
			this.props.entrantNumber
        )
		this.props.onBoardHit(
			e.target.getAttribute("data-value"),
            e.target.getAttribute("name"), // index
            e.target.getAttribute('data-ship-name'),
            e.target.getAttribute('data-ship-area'),
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
