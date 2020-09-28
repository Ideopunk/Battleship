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

it("Simple UI interaction", () => {
	const wrapper = shallow(<App />);
  wrapper.find(".orient").simulate("click");
  expect(wrapper.state('orientation')).toBe('vertical');
});

it("Test viewport function", () => {
	const rect = { x: 4, width: 4 };
	expect(viewport.convert(rect, 8)).toBe(1);
});
