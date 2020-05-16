import {render, unmountComponentAtNode} from "react-dom";
import {act} from "react-dom/test-utils";
import {MapInfo} from "./MapInfo";
import pretty from "pretty";
import React from "react";

describe("MapInfo", () => {
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
      render(<MapInfo/>, container);
    });

    expect(pretty(container.innerHTML)).toMatchInlineSnapshot(`
      "<div class=\\"Info\\">
        <div><span class=\\"InfoItem\\">Loading</span><span class=\\"ItemIcon\\"><svg aria-hidden=\\"true\\" focusable=\\"false\\" data-prefix=\\"fas\\" data-icon=\\"sync\\" class=\\"svg-inline--fa fa-sync fa-w-16 fa-spin \\" role=\\"img\\" xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 512 512\\"><path fill=\\"currentColor\\" d=\\"M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z\\"></path></svg></span></div>
      </div>"
    `);
  });

  it("should show loading if not initialised", () => {
    act(() => {
      render(<MapInfo initialised={false} isSaving={false}/>, container);
    });

    expect(container.textContent).toBe("Loading");
  });

  it("should show saving if saving", () => {
    act(() => {
      render(<MapInfo initialised={true} isSaving={true}/>, container);
    });

    expect(container.textContent).toBe("Saving");
  });
});