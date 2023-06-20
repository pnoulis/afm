import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import backendClientService from "../src/backend/backend.js";
import { generateRandomName } from "js_utils";
import { randomWristband } from "../scripts/randomWristband.js";
import { randomPlayer } from "../scripts/randomPlayer.js";
import { emulateScan } from "../scripts/emulateScan.js";
import * as Errors from "../src/errors.js";
import {
  loginPlayer,
  registerPlayer,
  registerWristband,
  unregisterWristband,
  mergeTeam,
} from "../src/backend/actions/index.js";
import { subscribeWristbandScan } from "../src/backend/subscriptions/index.js";

beforeAll(async () => {
  await backendClientService.init();
});

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
      await emulateScan();
      expect(listener).toHaveBeenCalledOnce();
    } catch (err) {
      subscription = err;
    }
  });

  it("Should unsubscribe from wristband scan", async () => {
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

  it("Should unregister a registered wristband", async () => {
    const rwristband = randomWristband();
    const rplayer = randomPlayer();
    await registerPlayer(rplayer);
    await expect(
      registerWristband({
        username: rplayer.username,
        wristbandNumber: rwristband.number,
      })
    ).resolves.toMatchObject({ result: "OK" });

    await expect(
      unregisterWristband({
        username: rplayer.username,
        wristbandNumber: rwristband.number,
      })
    ).resolves.toMatchObject({ result: "OK" });
  });

  it("Should reject when trying to unregister an unregistered wristband", async () => {
    const rwristband = randomWristband();
    const rplayer = randomPlayer();
    await registerPlayer(rplayer);

    await expect(
      unregisterWristband({
        username: rplayer.username,
        wristbandNumber: rwristband.number,
      })
    ).rejects.toThrowError(Errors.ModelError);
  });
  // TODO Does not work
  it.skip("Should reject when unregisterWristband does not provide the required payload", async () => {
    await expect(
      unregisterWristband({
        username: "yolo",
        wristbandNumber: undefined,
      })
    ).rejects.toThrowError(Errors.ModelError);

    await expect(
      unregisterWristband({
        username: null,
        wristbandNumber: 6,
      })
    ).rejects.toThrowError(Errors.ModelError);
  });
  it("Should merge a team", async () => {
    const roster = new Array(6).fill(null).map((_) => randomPlayer());
    const uniqueWristbands = [
      {
        wristbandNumber: 332,
        wristbandColor: 0,
      },
      {
        wristbandNumber: 333,
        wristbandColor: 1,
      },
      {
        wristbandNumber: 334,
        wristbandColor: 2,
      },
      {
        wristbandNumber: 335,
        wristbandColor: 3,
      },
      {
        wristbandNumber: 336,
        wristbandColor: 4,
      },
      {
        wristbandNumber: 337,
        wristbandColor: 5,
      },
    ];

    for (let i = 0; i < uniqueWristbands.length; i++) {
      await expect(registerPlayer(roster[i])).resolves.toMatchObject({
        result: "OK",
      });
      await expect(
        registerWristband({
          username: roster[i].username,
          wristbandNumber: uniqueWristbands[i].wristbandNumber,
        })
      ).resolves.toMatchObject({ result: "OK" });
    }

    const teamName = generateRandomName();

    await expect(
      mergeTeam({
        teamName: teamName,
        usernames: roster.map((player) => player.username),
      })
    ).resolves.toMatchObject({ result: "OK" });
  });
  // TODO
  it.skip("Should limit the roster size to 6", async () => {
    const roster = new Array(7).fill(null).map((_) => randomPlayer());
    const wristbands = randomWristband(7);

    for (const player of roster) {
      await expect(registerPlayer(player)).resolves.toMatchObject({
        result: "OK",
      });
      await expect(
        registerWristband({
          username: player.username,
          wristbandNumber: wristbands.pop().number,
        })
      ).resolves.toMatchObject({ result: "OK" });
    }

    const teamName = generateRandomName();
    expect(roster).toHaveLength(7);
    await expect(
      mergeTeam({
        teamName,
        usernames: roster.map((_) => _.username),
      })
    ).rejects.toThrowError(Errors.ModelError);
  });

  it("Should require all players in the team to have a registered wristband", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(5);

    for (const player of roster) {
      await expect(registerPlayer(player)).resolves.toMatchObject({
        result: "OK",
      });

      if (wristbands.length > 0) {
        await expect(
          registerWristband({
            username: player.username,
            wristbandNumber: wristbands.pop().number,
          })
        ).resolves.toMatchObject({ result: "OK" });
      }
    }

    const teamName = generateRandomName();
    await expect(
      mergeTeam({
        teamName,
        usernames: roster.map((_) => _.username),
      })
    ).rejects.toThrowError(Errors.ModelError);
  });
  it("All teams should have unique names", async () => {
    const roster1 = randomPlayer(6);
    const wristbands1 = randomWristband(6);

    for (const player of roster1) {
      await expect(registerPlayer(player)).resolves.toMatchObject({
        result: "OK",
      });

      await expect(
        registerWristband({
          username: player.username,
          wristbandNumber: wristbands1.pop().number,
        })
      ).resolves.toMatchObject({ result: "OK" });
    }

    const teamName = generateRandomName();
    await expect(
      mergeTeam({
        teamName,
        usernames: roster1.map((_) => _.username),
      })
    ).resolves.toMatchObject({ result: "OK" });

    const roster2 = randomPlayer(6);
    const wristbands2 = randomWristband(6);

    for (const player of roster2) {
      await expect(registerPlayer(player)).resolves.toMatchObject({
        result: "OK",
      });

      await expect(
        registerWristband({
          username: player.username,
          wristbandNumber: wristbands2.pop().number,
        })
      ).resolves.toMatchObject({ result: "OK" });
    }

    await expect(
      mergeTeam({
        teamName,
        usernames: roster2.map((_) => _.username),
      })
    ).rejects.toThrowError(Errors.ModelError);
  });
  it.only("Should ensure all players in a team are registered", async () => {
    const roster = randomPlayer(5);
    const wristbands = randomWristband(5);
    for (const player of roster) {
      await expect(registerPlayer(player)).resolves.toMatchObject({
        result: "OK",
      });

      if (wristbands.length > 0) {
        await expect(
          registerWristband({
            username: player.username,
            wristbandNumber: wristbands.pop().number,
          })
        ).resolves.toMatchObject({ result: "OK" });
      }
    }
    const teamName = generateRandomName();
    await expect(
      mergeTeam({
        teamName,
        usernames: ["oteuhnoetuhnteouhnth", ...roster.map((_) => _.username)],
      })
    ).rejects.toThrowError(Errors.ModelError);
  });
  // TODO
  it.skip("Should make sure all wristband colors are unique", async () => {});
});
