const test = (rect, mouseY, mouseX) => {
    console.log(rect, mouseY, mouseX)
    console.log(mouseX - rect.x)
    const x = mouseX - rect.x
    console.log(x / rect.width)
    return (x / rect.width)
};

export { test };

// bottom: 106
// height: 45
// left: 130.40000915527344
// right: 310.40000915527344
// top: 61
// width: 180
// x: 130.40000915527344
// y: 61