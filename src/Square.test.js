import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";
import { Square } from "./Square";

describe("Square", () => {
  let container = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("should match snapshot", () => {
    act(() => {
      render(<Square rect={{ x: 0, y: 0, w: 10, h: 10 }} />, container);
    });

    expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
      "<svg class=\\"Square\\">
        <polyline points=\\"0,0 0,10 10,10 10,0 0,0\\" style=\\"fill: none; stroke: #eee; stroke-width: 15;\\"></polyline>
      </svg>"
    `);
  });
});
