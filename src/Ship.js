import React, { Component } from "react";

class Ship extends Component {
	hit = (e) => {
        console.log('hit')
		this.props.onShipHit(
			e.target.getAttribute("name"), // ship area
			e.target.parentNode.getAttribute("data-value"), // ship number
			this.props.entrant // entrant number
		);
	};

    dragStart = e => {
        // console.log(e)
        // console.log(e.currentTarget)
        // console.log(e.target)
        // console.log(e.relatedTarget)
        const target = e.target;
        console.log(target)
        e.dataTransfer.setData('ship-number', e.target.getAttribute('data-value'))
    }

    dragOver = e => {
        e.stopPropagation();
    }

	checkDraggable = () => {
		let decision;
		if (this.props.entrant === 1) {
			console.log('1')
			decision = false
		} else if (this.props.board.some(cell => cell.shipNumber === this.props.shipNumber)) {
			console.log('some')
			decision = false
		} else {
			console.log(true)
			decision = true
		}
		return decision
	}

	render() {
		const divs = this.props.hits.parts.map((hit, index) => (
			<div
				key={index}
				name={index}
				data-value={hit}
                className={hit === false ? "ship" : "hit"}
                // draggable={this.checkDraggable}
                onDragStart={this.dragStart}
                onDragOver={this.dragOver}
                onClick={this.hit}
				id={`${this.props.entrant}-${this.props.title}-${index}`}
			></div>
		));

		return (
			<div
				id={`${this.props.entrant}-${this.props.title}`}
				name={this.props.title}
				className={`ship-div ${this.props.title} ${
					this.props.sunk === true ? "sunk" : ""
				} ${this.props.orientation === "vertical" ? "vertical" : ""}`}
                data-value={this.props.shipNumber}
                data-orientation={this.props.orientation}
				draggable={this.props.draggable}
				onDragStart={this.dragStart}
                onDragOver={this.dragOver}

			>
				{divs}
			</div>
		);
	}
}

export default Ship;
