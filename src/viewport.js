const test = (rect, mouseY, mouseX) => {
    console.log(rect, mouseY, mouseX)
    console.log(mouseX - rect.x)
    const x = mouseX - rect.x
    console.log(x / rect.width)
    return (x / rect.width)
};

export { test };

