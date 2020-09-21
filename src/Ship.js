import React, { Component } from "react";

class Ship extends Component {

    hit(e) {
        this.props.onShipHit(e.target.value, e.target.parentNode.value, this.props.side)
    }

    render() {
        const divs = this.props.hits.map((hit, index) => <div key={index} value={hit} onClick={this.hit}></div>)

        return (
            <div className={this.props.title} value={this.props.title}>{divs}</div>
        )
    }
}

export default Ship;