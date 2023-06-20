import { describe, it, expect, vi, beforeAll } from "vitest";
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../scripts/randomWristband.js";
import { randomPlayer } from "../../scripts/randomPlayer.js";
import { emulateScan } from "../../scripts/emulateScan.js";
import backendClientService from "../../src/backend/backend.js";
import * as Errors from "../../src/errors.js";
import {
  registerPlayer,
  registerWristband,
} from "../../src/backend/actions/index.js";

/* UNREGISTER WRISTBAND */
import { unregisterWristband } from "../../src/backend/actions/unregisterWristband.js";

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
    expect(response).toBeInstanceOf(Errors.ModelError);

    // Payload missing wristbandNumber
    try {
      response = await unregisterWristband({
        username: player.username,
      });
    } catch (err) {
      response = err;
    }
    expect(response).toBeInstanceOf(Errors.ModelError);

    // Payload missing username
    try {
      response = await unregisterWristband({
        wristbandNumber: wristband.number,
      });
    } catch (err) {
      response = err;
    }
    expect(response).toBeInstanceOf(Errors.ModelError);
    expect(response).toMatchObject({
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

    expect(response).toBeInstanceOf(Errors.ModelError);
    expect(response).toMatchObject({
      message: expect.any(String),
    });
  });
  it.skip("Should require the player's team is not inGame", async () => {});
});
