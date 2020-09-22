const attack = () => {
	return Math.floor(Math.random() * 100);
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
