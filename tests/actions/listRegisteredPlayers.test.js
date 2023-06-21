import { describe, it, expect, vi, beforeAll } from "vitest";
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../scripts/randomWristband.js";
import { randomPlayer } from "../../scripts/randomPlayer.js";
import { emulateScan } from "../../scripts/emulateScan.js";
import backendClientService from "../../src/backend/backend.js";
import * as Errors from "../../src/errors.js";
import { registerPlayer } from "../../src/backend/actions/index.js";

/* LIST REGISTERED PLAYERS */
import { listRegisteredPlayers } from "../../src/backend/actions/listRegisteredPlayers.js";

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
