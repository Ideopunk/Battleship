import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import * as viewport from "./viewport";

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

it("Method test: (Randomize, then) hit", () => {
	const wrapper = shallow(<App />);
	const instance = wrapper.instance();
	wrapper.find(".randomize").simulate("click");
	instance.playerTurnEnd(0);
	expect(instance.state.participants[1].board[0]).toEqual(
		expect.objectContaining({ status: "miss" || "hit" })
	);
});

it("Method test: (Randomize, hit, then) announcement", () => {
	const wrapper = shallow(<App />);
	const instance = wrapper.instance();
	wrapper.find(".randomize").simulate("click");
	instance.playerTurnEnd(0);
	expect(instance.state.message).toEqual(
		expect.arrayContaining(["Your attack misses!" || "Your attack hits!"])
	);
});

it("Method test: (Turn, then) reset", () => {
	const wrapper = shallow(<App />);
	const instance = wrapper.instance();
	wrapper.find(".randomize").simulate("click");
	instance.playerTurnEnd(0);
	instance.reset(-1);
	expect(instance.state.participants[0].board).toEqual(
		expect.arrayContaining([
			expect.not.objectContaining({
				status: "ship",
			}),
		])
	);
});

it("Viewport function", () => {
	const rect = { x: 4, width: 4 };
	expect(viewport.convert(rect, 8)).toBe(1);
});
