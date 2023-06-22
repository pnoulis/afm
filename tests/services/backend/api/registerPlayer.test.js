import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { registerPlayer } from "../../../../src/services/backend/api/registerPlayer.js";

/*
  DEPENDENCIES
 */
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../../../scripts/randomWristband";
import { randomPlayer } from "../../../../scripts/randomPlayer.js";
import { emulateScan } from "../../../../scripts/emulateScan.js";
import { backendClientService } from "../../../../src/services/backend/client.js";
import * as Errors from "../../../../src/misc/errors.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("registerPlayer", () => {
  it("Should register a player", async () => {
    const player = randomPlayer();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      result: "OK",
    });
  });
  it("Should respond with", async () => {
    const player = randomPlayer();
    let response;
    try {
      response = await registerPlayer(player);
    } catch (err) {
      response = err;
    }

    expect(response).toMatchObject({
      result: "OK",
      player: expect.objectContaining({
        username: player.username,
        name: player.name,
        surname: player.surname,
        email: player.email,
      }),
    });
  });
  it("Should validate the input", async () => {
    let response;
    try {
      response = await registerPlayer({});
    } catch (err) {
      response = err;
    }

    expect(response).toMatchObject({
      result: "NOK",
      validationErrors: {
        surname: "empty",
        username: "empty",
        name: "empty",
        email: "empty",
      },
    });
  });
  it("Should require unique player usernames", async () => {
    const player_one = randomPlayer();
    const player_two = randomPlayer();
    // duplicate usernames
    player_two.username = player_one.username;
    await expect(registerPlayer(player_one)).resolves.toMatchObject({
      result: "OK",
    });

    let response;
    try {
      response = await registerPlayer(player_two);
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      message: "This username already exists",
    });
  });
  it("Should require unique player emails", async () => {
    const player_one = randomPlayer();
    const player_two = randomPlayer();
    // duplicate emails
    player_two.email = player_one.email;
    await expect(registerPlayer(player_one)).resolves.toMatchObject({
      result: "OK",
    });

    let response;
    try {
      response = await registerPlayer(player_two);
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      message: expect.any(String),
    });
  });
});
