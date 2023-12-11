import { describe, it, expect, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
 */

import { Package } from "/src/entities/package/index.js";
import { stoms } from "/src/utils/misc.js";

describe("Entity package", () => {
  it("Should normalize representations and draw conclusions", () => {
    // mission package returned by listPackages
    expect(
      Package.normalize({
        name: "Per Mission 5",
        amount: 5,
        type: "mission",
        cost: 50,
      }),
    ).toMatchObject({
      id: null,
      name: expect.any(String),
      cost: 50,
      t_start: null,
      t_end: null,
      type: "mission",
      amount: 5,
      remainder: null,
      state: "new",
    });

    // time package returned by listPackages
    expect(
      Package.normalize({
        name: "Per Time 30",
        amount: 30,
        type: "time",
        cost: 50,
      }),
    ).toMatchObject({
      id: null,
      name: expect.any(String),
      cost: 50,
      t_start: null,
      t_end: null,
      type: "time",
      amount: 30,
      remainder: null,
      state: "new",
    });

    // time package returned by listTeams
    expect(
      Package.normalize({
        id: 3,
        name: "Per Time 60",
        cost: null,
        started: null,
        ended: null,
        duration: 3600,
        paused: false,
        active: false,
      }),
    ).toMatchObject({
      id: 3,
      name: expect.any(String),
      cost: null,
      t_start: null,
      t_end: null,
      type: "time",
      amount: stoms(3600),
      remainder: stoms(3600),
      state: "registered",
    });

    // mission package returned by listTeams
    // expect(
    //   Package.normalize({
    //     id: 4,
    //     name: "Per Mission 15",
    //     cost: null,
    //     started: null,
    //     ended: null,
    //     missions: 15,
    //     missionsPlayed: 0,
    //     active: false,
    //   }),
    // ).toMatchObject({
    //   id: 4,
    //   name: expect.any(String),
    //   cost: null,
    //   t_start: null,
    //   t_end: null,
    //   type: "mission",
    //   amount: 15,
    //   remainder: 15,
    //   state: "registered",
    // });
  });
});
