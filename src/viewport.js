const test = (rect, mouseY, mouseX) => {
	const x = mouseX - rect.x;
	return x / rect.width;
};

export { test };

// All praise to @themetar for explaining the power of getBoundingClientRect() :)
