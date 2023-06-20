import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { generateRandomName } from "js_utils";
import { randomWristband } from "../scripts/randomWristband.js";
import { randomPlayer } from "../scripts/randomPlayer.js";
import { emulateScan } from "../scripts/emulateScan.js";

describe.skip("wristband", () => {
  it("Should subscribe to wristband scans", async () => {});
  it("Should unsubscribe from wristband scans", async () => {});
  it("Should register a wristband to a player without one", async () => {});
  it("Should unregister a player's wristband", async () => {});
  it("Should prohibit registering a wristband to unregistered players", async () => {});
  it("Should prohibit registering a wristband while the player is in the inGame state", async () => {});
  it("Should require a wristband to be locked it its player", async () => {});
  it("Should not unregister an unoccupied wristband", async () => {});
});
