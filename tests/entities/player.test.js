import { describe, it, expect, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
 */

import { Player } from "/src/entities/player/index.js";

/*
  DEPENDENCIES
 */

import { Wristband } from "/src/entities/wristband/index.js";

describe("Entity player", () => {
  it("It should be able to take a player in any representation and normalize it into FRONTEND form", () => {
    expect(Player.normalize({})).toMatchObject({
      username: "",
      email: "",
      surname: "",
      name: "",
      password: "",
      wristband: expect.any(Object),
      state: "unregistered",
    });

    expect(
      Player.normalize({
        username: "backendPlayer",
        wristband: { id: 2, color: "3" },
      }),
    ).toMatchObject({
      username: "backendPlayer",
      state: "registered",
    });

    expect(
      Player.normalize({
        username: "backendPlayer",
        wristbandMerged: false,
        wristband: { id: 2, color: "3" },
      }),
    ).toMatchObject({
      username: "backendPlayer",
      state: "registered",
    });

    expect(
      Player.normalize({
        username: "backendPlayer",
        wristbandMerged: true,
        wristband: { id: 2, color: "3" },
      }),
    ).toMatchObject({
      username: "backendPlayer",
      state: "inTeam",
    });

    expect(() =>
      Player.normalize({
        username: "backendplayer",
        wristbandMerged: true,
      }),
    ).toThrow(Error);

    expect(Player.normalize(new Player())).toMatchObject({ state: "unregistered" });
    expect(Player.normalize({ username: "youth", state: "inGame" })).toMatchObject({
      state: "inGame",
    });
    expect(() => Player.normalize({ username: "youth", state: "unteuhn" })).toThrow(Error);
  });
});
