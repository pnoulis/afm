import { describe, it, expect, vi } from "vitest";
import backendClientService from "../src/backend/backend.js";
import { randomWristband } from "../scripts/randomWristband.js";
import { randomPlayer } from "../scripts/randomPlayer.js";
import { emulateScan } from "../scripts/emulateScan.js";
import * as Errors from "../src/errors.js";
import {
  loginPlayer,
  registerPlayer,
  registerWristband,
} from "../src/backend/actions/index.js";
import { subscribeWristbandScan } from "../src/backend/subscriptions/index.js";

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
  it("Should subscribe to wristband/scan", async () => {
    backendClientService.init();

    const listener = vi.fn((err, wristband) => {
      return {
        wristbandNumber: wristband.wristbandNumber,
        wristbandColor: wristband.wristbandColor,
      };
    });
    let subscription;
    try {
      subscription = await subscribeWristbandScan(listener);
      expect(subscription).toBeTypeOf("function");
      await emulateScan(666, 6);
      expect(listener).toHaveReturnedWith({
        wristbandNumber: 666,
        wristbandColor: 6,
      });
    } catch (err) {
      subscription = err;
    }
  });

  it("Should unsubscribe from wristband scan", async () => {
    backendClientService.init();
    const listener = vi.fn((err, wristband) => {
      return {
        wristbandNumber: wristband.wristbandNumber,
        wristbandColor: wristband.wristbandColor,
      };
    });
    let subscription;
    try {
      // successful subscription returns unsubscription function
      subscription = await subscribeWristbandScan(listener);
      await emulateScan();
      await emulateScan();
      await emulateScan();
      await emulateScan();
      expect(listener).toHaveBeenCalledTimes(2);
    } catch (err) {
      subscription = err;
    }
  });
  it("Should register a wristband to a player", async () => {
    const rwristband = randomWristband();
    const rplayer = randomPlayer();
    backendClientService.init();

    await registerPlayer(rplayer);
    await expect(
      registerWristband({
        username: rplayer.username,
        wristbandNumber: rwristband.number,
      })
    ).resolves.toMatchObject({
      result: "OK",
    });
  });

  it("Should not register a wristband to an unregistered player", async () => {
    const rwristband = randomWristband();
    const rplayer = randomPlayer();
    backendClientService.init();
    await expect(
      registerWristband({
        username: rplayer.username,
        wristbandNumber: rwristband.number,
      })
    ).rejects.toThrowError(Errors.ModelError);
  });

  it("Should not allow registering a wristband twice to the same player", async () => {
    const rwristband = randomWristband();
    const rplayer = randomPlayer();
    backendClientService.init();

    await registerPlayer(rplayer);
    await expect(
      registerWristband({
        username: rplayer.username,
        wristbandNumber: rwristband.number,
      })
    ).resolves.toMatchObject({
      result: "OK",
    });
    await expect(
      registerWristband({
        username: rplayer.username,
        wristbandNumber: rwristband.number,
      })
    ).rejects.toThrowError(Errors.ModelError);
  });

  it("Should not register a wristband that has already been registered to another player", async () => {
    const rwristband = randomWristband();
    const rplayer = randomPlayer();
    const rplayer_2 = randomPlayer();
    backendClientService.init();
    await registerPlayer(rplayer);
    await registerPlayer(rplayer_2);
    await expect(
      registerWristband({
        username: rplayer.username,
        wristbandNumber: rwristband.number,
      })
    ).resolves.toMatchObject({ result: "OK" });

    await expect(
      registerWristband({
        username: rplayer_2.username,
        wristbandNumber: rwristband.number,
      })
    ).rejects.toThrowError(Errors.ModelError);
  });
});
