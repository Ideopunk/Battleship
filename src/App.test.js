import React from "react";
import { render, unmountComponentAtNode } from "@testing-library/react";
// import { act } from 'react-dom/test-utils';
import { shallow, mount } from "enzyme";
import App from "./App";
import Board from "./Board";
import * as viewport from "./viewport";

// let container = null;

// beforeEach(() => {
//   // setup a DOM element as a render target
//   container = document.createElement("div");
//   document.body.appendChild(container);
// });

// afterEach(() => {
//   // cleanup on exiting
//   unmountComponentAtNode(container);
//   container.remove();
//   container = null;
// });

// xit("renders learn react link", () => {
// 	const { getByText } = render(<App />);
// 	const linkElement = getByText(/learn react/i);
// 	expect(linkElement).toBeInTheDocument();
// });

it("Renders without crashing", () => {
	shallow(<App />);
});

it("Simple: Starter state", () => {
	const wrapper = shallow(<App />);
	expect(wrapper.state("orientation")).toBe("horizontal");
});

it("UI test: Simple interaction", () => {
	const wrapper = shallow(<App />);
	wrapper.find(".orient").simulate("click");
	expect(wrapper.state("orientation")).toBe("vertical");
});

it("Method test: Board state update: Placeship", () => {
	const wrapper = shallow(<App />);
	const instance = wrapper.instance();
	instance.placeShip(0, 0, 0, 0);
	expect(instance.state.participants[0].board[0]).toMatchObject({
		status: "ship",
		shipNumber: 0,
		shipArea: 0,
	});
});

it("UI test: Board state update: Randomize", () => {
	const wrapper = shallow(<App />);
	const instance = wrapper.instance();
	wrapper.find(".randomize").simulate("click");
	expect(instance.state.participants[0].board).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				status: "ship",
			}),
		])
	);
});

it("Viewport function", () => {
	const rect = { x: 4, width: 4 };
	expect(viewport.convert(rect, 8)).toBe(1);
});
