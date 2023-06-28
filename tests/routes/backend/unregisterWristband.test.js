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

describe("unregisterWristband", () => {
  it("Should accept params BackendPlayer and FrontendWristband", async () => {
    const wristband = randomWristband();
    const player = randomPlayer();

    await expect(ROUTES_BACKEND.registerPlayer(player)).resolves.toBeTruthy();
    await expect(
      ROUTES_BACKEND.registerWristband({ player, wristband })
    ).resolves.toBeTruthy();

    await expect(
      ROUTES_BACKEND.unregisterWristband({ player, wristband })
    ).resolves.toBeTruthy();
  });
  it("Should accept params BackendPlayer and BackendWristband", async () => {
    const wristband = randomWristband();
    const player = randomPlayer();

    await expect(ROUTES_BACKEND.registerPlayer(player)).resolves.toBeTruthy();
    await expect(
      ROUTES_BACKEND.registerWristband({ player, wristband })
    ).resolves.toBeTruthy();

    await expect(
      ROUTES_BACKEND.unregisterWristband({
        player,
        wristband: {
          wristbandNumber: wristband.number,
        },
      })
    ).resolves.toBeTruthy();
  });
  it("Should resolve with", async () => {
    const wristband = randomWristband();
    const player = randomPlayer();

    await expect(ROUTES_BACKEND.registerPlayer(player)).resolves.toBeTruthy();
    await expect(
      ROUTES_BACKEND.registerWristband({ player, wristband })
    ).resolves.toBeTruthy();

    const response = await ROUTES_BACKEND.unregisterWristband({
      player,
      wristband,
    });
    expect(response).toMatchObject({
      number: wristband.number,
      username: player.username,
      msg: expect.any(String),
    });
  });
});
