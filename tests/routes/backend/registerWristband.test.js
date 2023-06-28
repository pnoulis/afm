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

describe("registerWristband", () => {
  it("Should accept params BackendPlayer and FrontendWristband", async () => {
    const player = randomPlayer();
    const wristband = randomWristband();

    await ROUTES_BACKEND.registerPlayer(player);

    await expect(
      ROUTES_BACKEND.registerWristband({
        // BACKEND PLAYER
        player,
        // FRONTEND WRISTBAND
        wristband,
      })
    ).resolves.toMatchObject({
      number: wristband.number,
    });
  });
  it("Should accept params BackendPlayer and BackendWristband", async () => {
    const player = randomPlayer();
    const wristband = randomWristband();

    await ROUTES_BACKEND.registerPlayer(player);

    await expect(
      ROUTES_BACKEND.registerWristband({
        // FRONT END PLAYER
        player,

        // BACKEND WRISTBAND
        wristband: {
          wristbandNumber: wristband.number,
          wristbandColor: wristband.color,
        },
      })
    ).resolves.toMatchObject({
      number: wristband.number,
    });
  });
  it("Should resolve with", async () => {
    const player = randomPlayer();
    const wristband = randomWristband();

    await ROUTES_BACKEND.registerPlayer(player);
    const response = await ROUTES_BACKEND.registerWristband({
      player,
      wristband,
    });
    expect(response).toMatchObject({
      number: wristband.number,
    });
  });
});
