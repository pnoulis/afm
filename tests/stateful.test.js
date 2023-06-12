import { describe, it, expect, vi } from "vitest";
// import { stateful } from '../src/stateful.js';

function stateful() {
  const self = this;
  Object.defineProperty(self, "state", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "yolo",
  });
}

describe("stateful", () => {
  it("Create the player prototype object", () => {
    const ProtoPlayer = new stateful();
    console.log(ProtoPlayer instanceof stateful);
    expect(ProtoPlayer).toHaveProperty('state');
  });
});
