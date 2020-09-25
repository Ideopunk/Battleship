const attack = (lastCompAttack) => {
	const { status, coordinate } = lastCompAttack;
	if (status === "miss") {
		return Math.floor(Math.random() * 100);
	} else {
		const temp = Math.floor(Math.random() * 45);
		let returnValue;
		if (temp < 10) {
			returnValue = coordinate - 1;
		} else if (temp < 20) {
			returnValue = coordinate + 1;
		} else if (temp < 30) {
			returnValue = coordinate - 10;
		} else if (temp < 40) {
			returnValue = coordinate + 10;
		} else {
			returnValue = Math.floor(Math.random() * 100);
		}

		// Don't go off the board.
		if (returnValue < 0 || 99 < returnValue) {
			returnValue = Math.floor(Math.random() * 100);
		}

		return returnValue;
	}
};

const boardpoint = (length, orientation) => {
	if (orientation === "vertical") {
		const biglength = length * 10;
		return Math.floor(Math.random() * (100 - biglength));
	} else {
		let numb = Math.floor(Math.random() * 100);
		while (numb % 10 > 10 - length) {
			numb = Math.floor(Math.random() * 100);
		}
		return numb;
	}
};

export { attack, boardpoint };
