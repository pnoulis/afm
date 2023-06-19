import { describe, it, expect, vi } from "vitest";
import backendClientService from "../src/backend/backend.js";
import { loginPlayer, registerPlayer } from "../src/backend/actions/index.js";
import { randomPlayer } from "../scripts/randomPlayer.js";
import * as Errors from "../src/errors.js";

describe("actions", () => {
  it("should successfully boot", async () => {
    await expect(backendClientService.init()).resolves.toMatchObject({
      result: "OK",
    });
  });
  it("Should validate the registration form data", async () => {
    const rplayer = randomPlayer();
    rplayer.name = "";
    rplayer.username = "";

    let res;
    try {
      res = await registerPlayer(rplayer);
    } catch (err) {
      res = err;
    }

    expect(res).toBeInstanceOf(Errors.ValidationError);
    expect(res).toMatchObject({
      message: "ValidationError",
      cause: {
        name: "empty",
        username: "empty",
      },
    });

    await expect(registerPlayer(rplayer)).rejects.toThrowError(
      Errors.ValidationError
    );
  });
  it("should successfully register a player", async () => {
    const rplayer = randomPlayer();
    await expect(registerPlayer(rplayer)).resolves.toMatchObject({
      result: "OK",
      player: {
        name: rplayer.name,
        surname: rplayer.surname,
        username: rplayer.username,
        email: rplayer.email,
      },
    });
  });
  it("Should not register a player twice", async () => {
    const rplayer = randomPlayer();
    await expect(registerPlayer(rplayer)).resolves.toMatchObject({
      result: "OK",
      player: {
        name: rplayer.name,
        surname: rplayer.surname,
        username: rplayer.username,
        email: rplayer.email,
      },
    });

    let res;
    try {
      res = await registerPlayer(rplayer);
    } catch (err) {
      res = err;
    }
    expect(res).toBeInstanceOf(Errors.ModelError);
    expect(res).toMatchObject({
      message: "This username already exists",
      cause: {
        result: "NOK",
      },
    });
  });
  it("Should validate the login form data", async () => {
    backendClientService.init();
    let res;
    try {
      res = await loginPlayer({
        username: "",
        password: "",
      });
    } catch (err) {
      res = err;
    }

    expect(res).toBeInstanceOf(Errors.ValidationError);
    expect(res).toMatchObject({
      message: "ValidationError",
      cause: {
        password: "empty",
        username: "empty",
      },
    });
  });
  it("Should login a registered player", async () => {
    backendClientService.init();
    const rplayer = randomPlayer();

    await expect(registerPlayer(rplayer)).resolves.toMatchObject({
      result: "OK",
    });

    await expect(
      loginPlayer({
        username: rplayer.username,
        password: rplayer.password,
      })
    ).resolves.toMatchObject({
      result: "OK",
      player: {
        name: rplayer.name,
        surname: rplayer.surname,
        username: rplayer.username,
        email: rplayer.email,
      },
    });
  });
  it("Should not login an unregistered player", async () => {
    backendClientService.init();

    let res;
    try {
      res = await loginPlayer({
        username: "teuhnoeuthoneuth",
        password: "c.,pghl.,cpg.,eunth",
      });
    } catch (err) {
      res = err;
    }

    expect(res).toBeInstanceOf(Errors.ModelError);
    expect(res).toMatchObject({
      message: "Wrong username and/or password",
      cause: {
        result: "NOK",
      },
    });
  });
});
