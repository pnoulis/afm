import { describe, it, expect, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
 */

import { Package } from "/src/entities/package/index.js";

describe("Entity package", () => {
  it("Should normalize representations", () => {
    const packages = [
      // packages returned by listPackages
      { name: "Per Mission 5", amount: 5, type: "mission", cost: 50 },
      { name: "Per Time 30", amount: 30, type: "time", cost: 50 },
      // a time package returned a listTeams
      {
        id: 3,
        name: "Per Time 60",
        cost: null,
        started: null,
        ended: null,
        duration: 3600,
        paused: false,
        active: false,
      },
      // a missions package returned by listTeams
      {
        id: 4,
        name: "Per Mission 15",
        cost: null,
        started: null,
        ended: null,
        missions: 15,
        missionsPlayed: 0,
        active: false,
      },
    ];

    expect(Package.normalize(packages[0])).toMatchObject({

    })
  });
});
