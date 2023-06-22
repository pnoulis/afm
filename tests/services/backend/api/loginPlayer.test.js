import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { loginPlayer } from "../../../../src/services/backend/api/loginPlayer.js";

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

describe("loginPlayer", () => {
  it("Should login a player", async () => {
    const player = randomPlayer();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      result: "OK",
    });
    await expect(
      loginPlayer({
        username: player.username,
        password: player.password,
      })
    ).resolves.toMatchObject({ result: "OK" });
  });
  it("Should respond with", async () => {
    let player = randomPlayer();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      result: "OK",
    });
    let response;
    try {
      response = await loginPlayer({
        username: player.username,
        password: player.password,
      });
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
    await expect(loginPlayer({})).resolves.toMatchObject({
      result: "NOK",
      validationErrors: {
        username: "empty",
        password: "empty",
      },
    });
  });
  it("Should require the player to be registered", async () => {
    // just in case that random player was previously registered
    // try and login 3 random players.
    let players = randomPlayer(3);
    for (const player of players) {
      await expect(
        loginPlayer({
          username: players[0].username,
          password: players[0].password,
        })
      ).resolves.toMatchObject({
        result: "NOK",
        message: "Wrong username and/or password",
      });
    }
  });
});
