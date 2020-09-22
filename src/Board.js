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
        try {
            this.props.boardHit(
                e.target.getAttribute("data-value"),
                e.target.getAttribute("name"), // index
            ) 
        } catch(e){
            console.log(e)
            console.log('wrong board pal')
        }
		
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
		return (
			<div className="board" id={`board-${this.props.entrantNumber}`}>
				{cellsDisplay}
			</div>
		);
	}
}

export default Board;
