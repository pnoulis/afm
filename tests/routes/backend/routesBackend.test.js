import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import * as ROUTES_BACKEND from "../../../src/routes/backend/routesBackend";

/*
  DEPENDENCIES
 */
import { backendClientService } from "../../../src/services/backend/client.js";
import { randomPlayer } from "../../../scripts/randomPlayer.js";
import { randomWristband } from "../../../scripts/randomWristband.js";
import { emulateScan } from "../../../scripts/emulateScan.js";
import { Player } from "../../../src/afmachine/player/index.js";
import { Wristband } from "../../../src/afmachine/wristband/index.js";
import * as Errors from "../../../src/misc/errors.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("routesBackend", () => {
  it("Should list packages", async () => {
    const { listPackages } = ROUTES_BACKEND;
    expect(listPackages).toBeTypeOf("function");
    let response;
    try {
      response = await listPackages();
    } catch (err) {
      response = err;
    }
    expect(response.res.result).toBe("OK");
    expect(response.res.packages.length).toBeGreaterThanOrEqual(1);
  });

  it("Should register a player", async () => {
    const { registerPlayer } = ROUTES_BACKEND;
    expect(registerPlayer).toBeTypeOf("function");
    const player = randomPlayer();
    let response;
    try {
      response = await registerPlayer(player);
    } catch (err) {
      response = err;
    }
    expect(response.res.result).toBe("OK");
    expect(response.res.player).toBeInstanceOf(Player);
    expect(response.res.player.inState("registered")).toBeTruthy();
  });

  it("Should subscribe to wristband scans", async () => {
    const { subscribeWristbandScan } = ROUTES_BACKEND;
    expect(subscribeWristbandScan).toBeTypeOf("function");
    const spyWristbandScanListener = vi.fn((err, wristband) => {
      console.log(wristband);
    });
    let response;
    try {
      response = await subscribeWristbandScan({
        listener: spyWristbandScanListener,
      });
      await emulateScan();
    } catch (err) {
      response = err;
    }
    expect(response.res).toBeTypeOf("function");
    expect(spyWristbandScanListener).toHaveBeenCalledOnce();
    expect(spyWristbandScanListener).toHaveBeenCalledWith(null, {
      color: expect.any(Number),
      number: expect.any(Number),
    });
  });
  it.only("Should register a wristband", async () => {
    const { registerWristband, registerPlayer } = ROUTES_BACKEND;
    expect(registerWristband).toBeTypeOf("function");
    const player = randomPlayer();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      res: {
        result: "OK",
      },
    });
    const wristband = randomWristband();
    let response;
    try {
      response = await registerWristband({
        player,
        wristband,
      });
    } catch (err) {
      response = err;
    }
    expect(response.res.result).toBe("OK");
  });

  it.skip("Should login a player", async () => {
    const { loginPlayer } = ROUTES_BACKEND;
    expect(loginPlayer).toBeTypeOf("function");
    let response;
    try {
      response = await loginPlayer();
    } catch (err) {}
  });
});
