import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { searchPlayer } from "../../../../src/services/backend/api/searchPlayer.js";

/*
  DEPENDENCIES
 */
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../../../scripts/randomWristband";
import { randomPlayer } from "../../../../scripts/randomPlayer.js";
import { emulateScan } from "../../../../scripts/emulateScan.js";
import { backendClientService } from "../../../../src/services/backend/client.js";
import * as Errors from "../../../../src/misc/errors.js";
import {
  registerPlayer,
  registerWristband,
} from "../../../../src/services/backend/api/index.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("searchPlayer", () => {
  it("Should search for player", async () => {
    await expect(
      searchPlayer({
        searchTerm: "whatever",
      })
    ).resolves.toMatchObject({ result: "OK" });
  });
  it("Should return the right number of candidates", async () => {
    const players = randomPlayer(2);
    for (const player of players) {
      await expect(registerPlayer(player)).resolves.toMatchObject({
        result: "OK",
      });
    }
    let response;
    try {
      response = await searchPlayer({
        searchTerm: players[0].username,
      });
    } catch (err) {
      response = err;
    }

    expect(response.result).toEqual("OK");
    expect(response.players).toHaveLength(1);

    try {
      response = await searchPlayer({
        searchTerm: players[0].username[0],
      });
    } catch (err) {
      response = err;
    }
    expect(response.result).toEqual("OK");
    expect(response.players.length).toBeGreaterThanOrEqual(2);
  });
});
