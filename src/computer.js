const attack = (lastCompAttack) => {
	console.log(lastCompAttack);
	const { status, coordinate } = lastCompAttack;
	if (status === "miss") {
		return Math.floor(Math.random() * 100);
	} else {
		const temp = Math.floor(Math.random() * 45);
		if (temp < 10 ) {
			return coordinate - 1;
		} else if (temp < 20) {
			return coordinate + 1;
		} else if (temp < 30) {
			return coordinate - 10;
		} else if (temp < 40) {
			return coordinate + 10;
		} else {
			return Math.floor(Math.random() * 100);
		}
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
