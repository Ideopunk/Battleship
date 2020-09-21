import React, { Component } from "react";

class Board extends Component {
    hit = e => {
        this.props.onBoardHit(
            e.target.getAttribute("data-value"),
            e.target.getAttribute("name"), // index
            this.props.entrantNumber
        )
    }

	render() {
		const cells = this.props.cells;
		const cellsDisplay = cells.map((cell, index) => (
			<div
				className={`cell ${cell}`}
				data-value={cell}
				name={index}
                key={index}
                onClick={this.hit}
			></div>
		));
		return <div className="board">{cellsDisplay}</div>;
	}
}

export default Board;
