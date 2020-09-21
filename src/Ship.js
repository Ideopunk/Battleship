import React, { Component } from "react";

class Ship extends Component {
	hit = e => {
		this.props.onShipHit(
            e.target.getAttribute('data-value'), // ship status
            e.target.getAttribute('name'), // ship areat
			e.target.parentNode.getAttribute('data-value'), // ship number
            this.props.entrant // entrant number
		);
	};

	render() {
		console.log(this.props);
		const divs = this.props.hits.map((hit, index) => (
			<div
                key={index}
                name={index}
				data-value={hit}
				className={hit === false ? "ship-cell" : "hit-cell"}
				onClick={this.hit}
			></div>
		));

		return (
			<div className={`${this.props.title} + ${this.props.sunk === true? "sunk" : null}`} data-value={this.props.shipNumber}>
				{divs}
			</div>
		);
	}
}

export default Ship;
