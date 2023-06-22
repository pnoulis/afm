import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { unregisterWristband } from "../../../../src/services/backend/api/unregisterWristband.js";

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

describe("unregisterWristband", () => {
  it("Should unregister a player's wristband", async () => {
    const player = randomPlayer();
    const wristband = randomWristband();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      result: "OK",
    });
    await expect(
      registerWristband({
        username: player.username,
        wristbandNumber: wristband.number,
      })
    ).resolves.toMatchObject({ result: "OK" });
    await expect(
      unregisterWristband({
        username: player.username,
        wristbandNumber: wristband.number,
      })
    ).resolves.toMatchObject({ result: "OK" });
  });
  it("Should respond with", async () => {
    const player = randomPlayer();
    const wristband = randomWristband();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      result: "OK",
    });
    await expect(
      registerWristband({
        username: player.username,
        wristbandNumber: wristband.number,
      })
    ).resolves.toMatchObject({ result: "OK" });

    let response;
    try {
      response = await unregisterWristband({
        username: player.username,
        wristbandNumber: wristband.number,
      });
    } catch (err) {
      response = err;
    }

    expect(response).toMatchObject({
      result: "OK",
      message: "successfully unregisterWristbandToPlayer",
    });
  });
  it("Should validate the input", async () => {
    const player = randomPlayer();
    const wristband = randomWristband();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      result: "OK",
    });
    await expect(
      registerWristband({
        username: player.username,
        wristbandNumber: wristband.number,
      })
    ).resolves.toMatchObject({ result: "OK" });

    // Missing payload
    let response;
    try {
      response = await unregisterWristband({});
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      validationErrors: {
        username: "empty",
        wristbandNumber: "empty",
      },
    });

    // Payload missing wristbandNumber
    try {
      response = await unregisterWristband({
        username: player.username,
      });
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      validationErrors: {
        wristbandNumber: "empty",
      },
    });

    // Payload missing username
    try {
      response = await unregisterWristband({
        wristbandNumber: wristband.number,
      });
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      message: "player with this username doesn't exist",
    });
  });
  it("Should require the wristband is NOT free", async () => {
    const player = randomPlayer();
    const wristband = randomWristband();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      result: "OK",
    });

    let response;
    try {
      response = await unregisterWristband({
        username: player.username,
        wristbandNumber: wristband.number,
      });
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      message: expect.stringContaining("Cannot invoke"),
    });
  });
  it.todo("Should require the player's team is not inGame", async () => {});
});
