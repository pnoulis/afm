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

describe("infoWristband", () => {
  it("Should accept params FrontendWristband", async () => {
    const wristband = randomWristband();

    await expect(
      ROUTES_BACKEND.infoWristband(wristband)
    ).resolves.toMatchObject({
      number: wristband.number,
    });
  });
  it("Should accept params BackendWristband", async () => {
    const wristband = randomWristband();

    await expect(
      ROUTES_BACKEND.infoWristband({
        wristbandNumber: wristband.number,
      })
    ).resolves.toMatchObject({
      number: wristband.number,
    });
  });
  it("Should resolve with", async () => {
    const wristband = randomWristband();
    const response = await ROUTES_BACKEND.infoWristband(wristband);
    expect(response).toMatchObject({
      number: wristband.number,
      active: expect.any(Boolean),
    });
    expect(response.color).toSatisfy(
      (color) => color === wristband.color || color == null
    );
  });
});
