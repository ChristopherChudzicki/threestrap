/* global THREE */

describe("stats", function () {
  it("adds stats to the dom", function () {
    const options = {
      plugins: ["bind", "renderer", "stats"],
    };

    expect(document.querySelector("#stats")).toBeFalsy();

    const three = new Threestrap.Bootstrap(options);

    expect(document.querySelector("#stats")).toBeTruthy();

    three.destroy();

    expect(document.querySelector("#stats")).toBeFalsy();
  });
});
