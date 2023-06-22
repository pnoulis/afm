import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { listRegisteredPlayers } from "../../../../src/services/backend/api/listRegisteredPlayers.js";

/*
  DEPENDENCIES
 */
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../../../scripts/randomWristband";
import { randomPlayer } from "../../../../scripts/randomPlayer.js";
import { emulateScan } from "../../../../scripts/emulateScan.js";
import { backendClientService } from "../../../../src/services/backend/client.js";
import * as Errors from "../../../../src/misc/errors.js";
import { registerPlayer } from "../../../../src/services/backend/api/index.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("listRegisteredPlayers", () => {
  it("Should resolve", async () => {
    await expect(listRegisteredPlayers()).resolves.toMatchObject({
      result: "OK",
    });
  });

  it("Should respond with", async () => {
    const player = randomPlayer();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      result: "OK",
    });

    let response;
    try {
      response = await listRegisteredPlayers();
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "OK",
      players: expect.any(Array),
    });
    expect(response.players.length).toBeGreaterThan(0);
  });
});
