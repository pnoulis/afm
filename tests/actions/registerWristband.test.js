import { describe, it, expect, vi, beforeAll } from "vitest";
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../scripts/randomWristband.js";
import { randomPlayer } from "../../scripts/randomPlayer.js";
import { emulateScan } from "../../scripts/emulateScan.js";
import backendClientService from "../../src/backend/backend.js";
import * as Errors from "../../src/errors.js";
import { registerPlayer } from "../../src/backend/actions/index.js";

/* REGISTER WRISTBAND */
import { registerWristband } from "../../src/backend/actions/registerWristband.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("registerWristband", () => {
  it("Should register a wristband", async () => {
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
  });
  it("Should respond with", async () => {
    const player = randomPlayer();
    const wristband = randomWristband();

    await expect(registerPlayer(player)).resolves.toMatchObject({
      result: "OK",
    });
    let response;
    try {
      response = await registerWristband({
        username: player.username,
        wristbandNumber: wristband.number,
      });
    } catch (err) {
      response = err;
    }

    expect(response).toMatchObject({
      result: "OK",
      message: "successfully registerWristbandToPlayer",
    });
  });
  it("Should validate the input", async () => {
    const player = randomPlayer();
    const wristband = randomWristband();
    await expect(registerPlayer(player)).resolves.toMatchObject({
      result: "OK",
    });
    let response;

    // empty payload
    try {
      response = await registerWristband({});
    } catch (err) {
      response = err;
    }
    expect(response).toBeInstanceOf(Errors.ModelError);
    expect(response).toMatchObject({
      message: "player with this username doesn't exist",
    });

    // payload missing wristbandNumber
    try {
      response = await registerWristband({
        username: player.username,
      });
    } catch (err) {
      response = err;
    }
    expect(response).toBeInstanceOf(Errors.ModelError);
    expect(response).toMatchObject({
      message: expect.any(String),
    });
  });
  it("Should require the player to be registered", async () => {
    const player = randomPlayer();
    const wristband = randomWristband();
    let response;
    try {
      response = await registerWristband({
        username: player.username,
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
  it("Should require the wristband is free", async () => {
    const [pone, ptwo] = randomPlayer(2);
    const wristband = randomWristband();

    await expect(registerPlayer(pone)).resolves.toMatchObject({ result: "OK" });
    await expect(registerPlayer(ptwo)).resolves.toMatchObject({ result: "OK" });
    await expect(
      registerWristband({
        username: pone.username,
        wristbandNumber: wristband.number,
      })
    ).resolves.toMatchObject({ result: "OK" });

    let response;
    try {
      response = await registerWristband({
        username: ptwo.username,
        wristbandNumber: wristband.number,
      });
    } catch (err) {
      response = err;
    }
    expect(response).toBeInstanceOf(Errors.ModelError);
    expect(response).toMatchObject({
      message: expect.stringMatching(
        /wristband with number.*is already registered/
      ),
    });
  });
  it.skip("Should require the player's team is not inGame", async () => {});
});
