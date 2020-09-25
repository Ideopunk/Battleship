import React, { Component } from "react";
import * as viewport from "./viewport";
class Ship extends Component {
    dragStart = e => {
		const percentArea = viewport.test(e.target.getBoundingClientRect(), e.clientY, e.clientX)
		const shipArea = Math.floor(percentArea * this.props.hits.parts.length)
		const shipObject = {
			shipNumber: e.target.getAttribute('data-value'),
			shipArea,
		}
        e.dataTransfer.setData('ship-data', JSON.stringify(shipObject))
    }

    dragOver = e => {
        e.stopPropagation();
    }

	render() {
		const divs = this.props.hits.parts.map((hit, index) => (
			<div
				key={index}
				name={index}
				data-value={hit}
                className={hit === false ? "ship" : "hit"}
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
				} ${this.props.orientation === "vertical" ? "vertical" : ""} unselectable`}
                data-value={this.props.shipNumber}
                data-orientation={this.props.orientation}
				draggable={this.props.draggable}
				onDragStart={this.dragStart}
				onDragOver={this.dragOver}
				unselectable="on"
				user-select="none"
			>
				{divs}
			</div>
		);
	}
}

export default Ship;
