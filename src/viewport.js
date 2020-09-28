const convert = (rect, mouseX) => {
	const x = mouseX - rect.x;
	return x / rect.width;
};

export { convert };

// All praise to @themetar for explaining the power of getBoundingClientRect() :)
