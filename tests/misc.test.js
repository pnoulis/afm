import { describe, it, expect, vi } from "vitest";
import { randomWristband } from "../scripts/randomWristband.js";
import { membersUnique } from "js_utils/misc";
import { WRISTBAND_COLORS } from "agent_factory.shared/constants.js";

describe("randomWristband", () => {
  it("Should return a wristband number and color", () => {
    const rwristband = randomWristband();
    expect(rwristband).toBeTypeOf("object");
    expect(rwristband).toHaveProperty("number");
    expect(rwristband).toHaveProperty("color");
    expect(rwristband.number).toBeTypeOf("number");
    expect(rwristband.color).toBeTypeOf("number");
  });
  it("Should provided the arguments ( n = 5) return an array of 5 wristbands", () => {
    const rwristbands = randomWristband(5);
    expect(rwristbands).toBeInstanceOf(Array);
    expect(rwristbands).toHaveLength(5);
  });
  it("Should provided the arguments (n = n) return wristbands with UNIQUE ids", () => {
    const rwristbands = randomWristband(5);
    const ids = rwristbands.map((wristband) => wristband.number);
    expect(membersUnique(ids)).toBe(true);
  });

  it("Should provided the flag (uniqueColors = true) return a maximum of WRISTBAND_COLORS.length array of wristbands all with UNIQUE IDS AND COLORS", () => {
    const rwristbands = randomWristband(100, true);
    const ids = rwristbands.map((wristband) => wristband.number);
    const colors = rwristbands.map((wristband) => wristband.color);
    expect(rwristbands).toHaveLength(WRISTBAND_COLORS.length - 1);
    expect(membersUnique(ids)).toBe(true);
    expect(membersUnique(colors)).toBe(true);
  });

  it("Should asked to provide N < WRISTBAND_COLOLRS.length and a flag (uniqueColors = true) return an array of N wristbands with UNIQUE COLORS and IDS", () => {
    const rwristbands = randomWristband(3, true);
    const ids = rwristbands.map((wristband) => wristband.number);
    const colors = rwristbands.map((wristband) => wristband.color);
    expect(rwristbands).toHaveLength(3);
    expect(membersUnique(ids)).toBe(true);
    expect(membersUnique(colors)).toBe(true);
  });
});
