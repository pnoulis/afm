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

describe("loginPlayer", () => {
  it("Should accept params BackendPlayer", async () => {
    const p = randomPlayer();
    await expect(ROUTES_BACKEND.registerPlayer(p)).resolves.toBeTruthy();
    await expect(ROUTES_BACKEND.loginPlayer(p)).resolves.toBeTruthy();
  });
  it("Should resolve with", async () => {
    const p = randomPlayer();
    await expect(ROUTES_BACKEND.registerPlayer(p)).resolves.toBeTruthy();
    const response = await ROUTES_BACKEND.loginPlayer(p);
    expect(response).toMatchObject({
      name: p.name,
      surname: p.surname,
      username: p.username,
      email: p.email,
    });
  });
});
