import React, { Component } from "react";

class Ship extends Component {
	hit = (e) => {
		this.props.onShipHit(
			e.target.getAttribute("data-value"), // ship status
			e.target.getAttribute("name"), // ship areat
			e.target.parentNode.getAttribute("data-value"), // ship number
			this.props.entrant // entrant number
		);
	};

    dragStart = e => {
        const target = e.target;
        e.dataTransfer.setData('id', e.target.id)
        // e.dataTransfer.setData('ship-length', e.target.childElementCount)
    }

    dragOver = e => {
        e.stopPropagation();
    }

	render() {
		const divs = this.props.hits.map((hit, index) => (
			<div
				key={index}
				name={index}
				data-value={hit}
				className={hit === false ? "ship-cell" : "hit-cell"}
				onClick={this.hit}
				id={`${this.props.entrant}-${this.props.title}-${index}`}
			></div>
		));

		return (
			<div
				id={`${this.props.entrant}-${this.props.title}`}
				name={this.props.title}
				className={`ship ${this.props.title} ${
					this.props.sunk === true ? "sunk" : null
				}`}
				data-value={this.props.shipNumber}
                draggable="true"
                onDragStart={this.dragStart}
                onDragOver={this.dragOver}

			>
				{divs}
			</div>
		);
	}
}

export default Ship;
