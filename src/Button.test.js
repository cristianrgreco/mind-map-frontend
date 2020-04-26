import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";
import { Button } from "./Button";

describe("Button", () => {
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
      render(<Button>Label</Button>, container);
    });

    expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`"<div class=\\"Button\\">Label</div>"`);
  });

  it("should render children", () => {
    act(() => {
      render(<Button>Label</Button>, container);
    });

    expect(container.textContent).toBe("Label");
  });

  it("should set props", () => {
    const onClick = jest.fn();

    act(() => {
      render(
        <Button id="button" onClick={onClick}>
          Label
        </Button>,
        container
      );
    });

    const button = document.querySelector("#button");

    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onClick).toHaveBeenCalled();
  });
});
