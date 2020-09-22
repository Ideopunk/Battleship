import React, { Component } from "react";

class Board extends Component {
	drop = (e) => {
        e.preventDefault();
        
		const shipID = e.dataTransfer.getData("id");
		const ship = document.getElementById(shipID);
		const shipLength = ship.childElementCount;
        const orientation = ship.getAttribute("data-orientation")
        let cellArray = [];
        let multiplier = (orientation === "horizontal"? 1 : 10)
		for (let i = 0; i < shipLength; i++) {
				cellArray.push(Number(e.target.getAttribute("name")) + i * multiplier);
		}
		

		this.distributeShip(cellArray, shipID);
	};

	distributeShip(cellArray, shipID) {
        console.log(cellArray)
		const boardID = `board-${this.props.entrantNumber}`;
        const board = document.getElementById(boardID);
        console.log(board)
		for (let [index, cell] of cellArray.entries()) {
			board.childNodes[cell].classList.remove("naw");
			board.childNodes[cell].classList.add("ship-cell");
			board.childNodes[cell].setAttribute("data-value", "ship");
			board.childNodes[cell].setAttribute("data-ship-name", shipID);
			board.childNodes[cell].setAttribute("data-ship-area", index);
		}
	}

	dragOver = (e) => {
		e.preventDefault();
	};

	hit = (e) => {
        try {
            this.props.boardHit(
                e.target.getAttribute("data-value"),
                e.target.getAttribute("name"), // index
                e.target.getAttribute("data-ship-name"),
                e.target.getAttribute("data-ship-area"),
                this.props.entrantNumber
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
