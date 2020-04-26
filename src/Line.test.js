import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {act} from "react-dom/test-utils";
import pretty from "pretty";
import {Line} from "./Line";

describe("Line", () => {
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
      render(
          <Line
              from={{x: 0, y: 0, w: 10, h: 10}}
              to={{x: 5, y: 5, w: 10, h: 10}}
          />,
          container
      );
    });

    expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
      "<svg class=\\"Line\\">
        <polyline points=\\"5,5 10,10\\" style=\\"fill: none; stroke: #ccc; stroke-width: 1;\\"></polyline>
      </svg>"
    `);
  });
});
