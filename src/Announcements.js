import React, { Component } from "react";

class Announcements extends Component {

	render() {
		const messages = this.props.message.map((message, index) => <p key={index}>{message}</p>);

		return (
			<div className="announcements">
				{messages}
			</div>
		);
	}
}

export default Announcements;
