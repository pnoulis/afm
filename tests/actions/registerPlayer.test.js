import { describe, it, expect, vi, beforeAll } from "vitest";
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../scripts/randomWristband.js";
import { randomPlayer } from "../../scripts/randomPlayer.js";
import { emulateScan } from "../../scripts/emulateScan.js";
import backendClientService from "../../src/backend/backend.js";
import * as Errors from "../../src/errors.js";

/* REGISTER PLAYER */
import { registerPlayer } from "../../src/backend/actions/registerPlayer.js";

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

    expect(response).toBeInstanceOf(Errors.ValidationError);
    expect(response).toMatchObject({
      cause: expect.objectContaining({
        surname: expect.any(String),
        username: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
      }),
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

    expect(response).toBeInstanceOf(Errors.ModelError);
    expect(response).toMatchObject({
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
    expect(response).toBeInstanceOf(Errors.ModelError);
  });
});
