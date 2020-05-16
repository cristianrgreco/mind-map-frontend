import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";
import { Node } from "./Node";
import { noop } from "./events";

describe("Node", () => {
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

  describe("snapshots", () => {
    it("root node", () => {
      act(() => {
        render(
          <Node
            value="Label"
            setValue={noop}
            x="100"
            y="100"
            backgroundColor="#eee"
            setStartDrag={noop}
            isNew={false}
            setIsNew={noop}
            isSelected={false}
            setIsSelected={noop}
            isRoot={true}
          />,
          container
        );
      });

      expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
              "<div class=\\"Node false undefined Root\\" style=\\"background-color: rgb(204, 204, 204); transform: translate3d(100px, 100px, 0);\\" draggable=\\"true\\">
                <div class=\\"Edit\\"></div><span>Label</span>
              </div>"
          `);
    });

    it("new node", () => {
      act(() => {
        render(
          <Node
            value="Label"
            setValue={noop}
            x="100"
            y="100"
            backgroundColor="#eee"
            setStartDrag={noop}
            isNew={true}
            setIsNew={noop}
            isSelected={false}
            setIsSelected={noop}
            isRoot={false}
          />,
          container
        );
      });

      expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
        "<div class=\\"Node false undefined false\\" style=\\"background-color: rgb(204, 204, 204); transform: translate3d(100px, 100px, 0);\\" draggable=\\"true\\">
          <div class=\\"Edit\\"><svg aria-hidden=\\"true\\" focusable=\\"false\\" data-prefix=\\"fas\\" data-icon=\\"pencil-alt\\" class=\\"svg-inline--fa fa-pencil-alt fa-w-16 \\" role=\\"img\\" xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 512 512\\">
              <path fill=\\"currentColor\\" d=\\"M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z\\"></path>
            </svg></div>
          <div style=\\"display: inline-block;\\"><input name=\\"Label\\" style=\\"box-sizing: content-box; width: 2px;\\" value=\\"Label\\">
            <div style=\\"position: absolute; top: 0px; left: 0px; visibility: hidden; height: 0px; overflow: scroll; white-space: pre; font-family: -webkit-small-control; letter-spacing: normal; text-transform: none;\\">Label</div>
          </div>
        </div>"
      `);
    });

    it("selected node", () => {
      act(() => {
        render(
          <Node
            value="Label"
            setValue={noop}
            x="100"
            y="100"
            backgroundColor="#eee"
            setStartDrag={noop}
            isNew={false}
            setIsNew={noop}
            isSelected={true}
            setIsSelected={noop}
            isRoot={false}
          />,
          container
        );
      });

      expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
        "<div class=\\"Node Selected undefined false\\" style=\\"background-color: rgb(204, 204, 204); transform: translate3d(100px, 100px, 0);\\" draggable=\\"true\\">
          <div class=\\"Edit\\"></div><span>Label</span>
        </div>"
      `);
    });
  });

  it("should set is selected on click", () => {
    const setIsSelected = jest.fn();

    act(() => {
      render(
        <Node
          value="Label"
          setValue={noop}
          x="100"
          y="100"
          backgroundColor="#eee"
          setStartDrag={noop}
          isNew={false}
          setIsNew={noop}
          isSelected={false}
          setIsSelected={setIsSelected}
          isRoot={true}
        />,
        container
      );
    });

    const node = document.querySelector(".Node");

    act(() => {
      node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(setIsSelected).toHaveBeenCalled();
  });

  it("should set is new to true on double click", () => {
    const setIsNew = jest.fn();

    act(() => {
      render(
        <Node
          value="Label"
          setValue={noop}
          x="100"
          y="100"
          backgroundColor="#eee"
          setStartDrag={noop}
          isNew={false}
          setIsNew={setIsNew}
          isSelected={false}
          setIsSelected={noop}
          isRoot={true}
        />,
        container
      );
    });

    const node = document.querySelector(".Node");

    act(() => {
      node.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    });

    expect(setIsNew).toHaveBeenCalledWith(true);
  });

  it("should set is new to false on enter key press if is new and value is set", () => {
    const setIsNew = jest.fn();

    act(() => {
      render(
        <Node
          value="Label"
          setValue={noop}
          x="100"
          y="100"
          backgroundColor="#eee"
          setStartDrag={noop}
          isNew={true}
          setIsNew={setIsNew}
          isSelected={false}
          setIsSelected={noop}
          isRoot={true}
        />,
        container
      );
    });

    const input = document.querySelector(".Node input");

    act(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });

    expect(setIsNew).toHaveBeenCalledWith(false);
  });

  it("should do nothing on enter key press if is not new", () => {
    const setIsNew = jest.fn();

    act(() => {
      render(
        <Node
          value="Label"
          setValue={noop}
          x="100"
          y="100"
          backgroundColor="#eee"
          setStartDrag={noop}
          isNew={false}
          setIsNew={setIsNew}
          isSelected={false}
          setIsSelected={noop}
          isRoot={true}
        />,
        container
      );
    });

    const input = document.querySelector(".Node input");

    expect(input).toBeNull();
  });

  it("should do nothing on enter key press if value is empty", () => {
    const setIsNew = jest.fn();

    act(() => {
      render(
        <Node
          value=""
          setValue={noop}
          x="100"
          y="100"
          backgroundColor="#eee"
          setStartDrag={noop}
          isNew={true}
          setIsNew={setIsNew}
          isSelected={false}
          setIsSelected={noop}
          isRoot={true}
        />,
        container
      );
    });

    const input = document.querySelector(".Node input");

    act(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });

    expect(setIsNew).not.toHaveBeenCalled();
  });
});
