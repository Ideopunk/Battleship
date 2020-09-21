import React from "react";
import { render, unmountComponentAtNode } from "@testing-library/react";
// import { act } from 'react-dom/test-utils';
import App from "./App";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

xit("renders learn react link", () => {
	const { getByText } = render(<App />);
	const linkElement = getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});

it("check state", () => {
	const wrapper = render(<App />);
	const player = wrapper.state("player");
	expect(player[0][0]).toBe(false);
});
