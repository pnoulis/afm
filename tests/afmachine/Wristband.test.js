import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { Wristband } from "../../src/afmachine/wristband/Wristband.js";

/*
  DEPENDENCIES
 */
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../scripts/randomWristband";
import { randomPlayer } from "../../scripts/randomPlayer.js";
import { emulateScan } from "../../scripts/emulateScan.js";
import { backendClientService } from "../../src/services/backend/client.js";
import * as Errors from "../../src/misc/errors.js";
import { delay } from "js_utils/misc";
import * as ROUTES_BACKEND from "../../src/routes/backend/routesBackend.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("Wristband", () => {
  it("Should instantiate a wristband object", () => {
    const w = new Wristband();
    expect(w).toBeInstanceOf(Wristband);
    expect(w.inState("empty")).toBeTruthy();
    expect(w.getState()).toBe("empty");
  });
  it("Should move the wristband to the scanned state when scan()", async () => {
    const w = new Wristband();
    w.scan((err, wristband) => {
      console.log("WRISTBAND SCANNED");
    });
    expect(w.inState("pairing")).toBeTruthy();
    await delay(1000);
    await emulateScan(2, 2);
    await delay(1000);
    expect(w.inState("scanned")).toBeTruthy();
    expect(w.number).toBe(2);
    expect(w.color).toBe(2);

    // just one wristband scan listener
    await emulateScan(3, 3);
    await delay(1000);
    expect(w.inState("scanned")).toBeTruthy();
    expect(w.number).toBe(2);
    expect(w.color).toBe(2);
  });
  it("Scan() should be a toggle", () => {
    const w = new Wristband();
    expect(w.inState("empty"));
    w.scan((err, wristband) => {
      console.log("oteuhoenuht");
    });

    expect(w.inState("pairing")).toBeTruthy();
    w.scan();
    expect(w.inState("empty")).toBeTruthy();
  });
  it("Trying to scan a wristband in the scanned state should thorw an error", async () => {
    const w = new Wristband();
    w.scan((err, wristband) => {
      console.log("WRISTBAND SCANNED");
    });
    expect(w.inState("pairing")).toBeTruthy();
    await delay(1000);
    await emulateScan(2, 2);
    await delay(1000);
    expect(w.inState("scanned")).toBeTruthy();
    expect(w.number).toBe(2);
    expect(w.color).toBe(2);
    w.scan((err, wrisband) => {
      expect(err).toBeInstanceOf(Errors.WristbandError);
      expect(err.code).toBe(1);
    });
  });
  it("register() in Empty state should throw an error", async () => {
    const w = new Wristband();
    let response;
    try {
      response = await w.register({});
    } catch (err) {
      response = err;
    }

    expect(response).toBeInstanceOf(Errors.WristbandError);
    expect(response.code).toBe(2);
  });
  it("register() in Pairing state should throw an error", async () => {
    const w = new Wristband();
    let response;
    try {
      response = await w.register({});
    } catch (err) {
      response = err;
    }

    expect(response).toBeInstanceOf(Errors.WristbandError);
    expect(response.code).toBe(2);
  });
  it("register() in Scanned state should resolve on Paired state", async () => {
    const { registerPlayer } = ROUTES_BACKEND;
    const player = randomPlayer();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      res: {
        result: "OK",
      },
    });

    const w = new Wristband();
    w.scan((err, wristband) => {
      console.log("WRISTBAND SCANNED");
    });
    expect(w.inState("pairing")).toBeTruthy();
    await delay(1000);
    await emulateScan();
    await delay(1000);
    expect(w.inState("scanned")).toBeTruthy();
    await w.register(player);
    expect(w.inState("paired")).toBeTruthy();
  });
  it.only("register() in Paired state should throw an error", async () => {
    const { registerPlayer } = ROUTES_BACKEND;
    const player = randomPlayer();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      res: {
        result: "OK",
      },
    });

    const w = new Wristband();
    w.scan((err, wristband) => {
      console.log("WRISTBAND SCANNED");
    });
    expect(w.inState("pairing")).toBeTruthy();
    await delay(1000);
    await emulateScan();
    await delay(1000);
    expect(w.inState("scanned")).toBeTruthy();
    await w.register(player);
    expect(w.inState("paired")).toBeTruthy();
    let response;
    try {
      response = await w.register(player);
    } catch (err) {
      response = err;
    }
    expect(response).toBeInstanceOf(Errors.WristbandError);
    expect(response.code).toBe(3);
  });
});
