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

describe("registerPlayer", () => {
  it("Should accept params BackendPlayer", async () => {
    const p = randomPlayer();
    await expect(ROUTES_BACKEND.registerPlayer(p)).resolves.toBeTruthy();
  });
  it("Should resolve with", async () => {
    const p = randomPlayer();
    const response = await ROUTES_BACKEND.registerPlayer(p);
    console.log(response);
    expect(response).toMatchObject({
      username: p.username,
      name: p.name,
      surname: p.surname,
      email: p.email,
    });
  });
});
