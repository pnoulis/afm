import { describe, it, expect, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
 */

import { Wristband, LiveWristband } from "/src/entities/wristband/index.js";

/*
  DEPENDENCIES
 */
import { emulateScan } from "agent_factory.shared/scripts/emulateScan.js";
import { delay } from "js_utils/misc";
import { randomWristband } from "agent_factory.shared/scripts/randomWristband.js";

// const wristbands = [new Wristband2(), new Wristband2(), new Wristband2()];

describe("Entity wristband", () => {
  it("It should scan a wristband", async () => {
    const response = new Promise((resolve, reject) => {
      wristbands[0].togglePair((err, wristband) => {
        err ? reject(err) : resolve(wristband);
      });
    });
    delay(2000).then(emulateScan);
    await expect(response).resolves.toMatchObject({ result: "OK" });
  });
  it.only("Should be able to take a wristband in any representation and normalize it into its FRONTEND form", () => {
    expect(
      Wristband.normalize({
        wristbandNumber: 0,
        wristbandColor: 6,
        active: true,
      }),
    ).toMatchObject({
      id: 0,
      color: 6,
      state: "registered",
    });
    expect(
      Wristband.normalize({
        wristbandNumber: 0,
        wristbandColor: 6,
        active: false,
      }),
    ).toMatchObject({
      id: 0,
      color: 6,
      state: "paired",
    });
    expect(
      Wristband.normalize({
        wristbandColor: 6,
        active: true,
      }),
    ).toMatchObject({
      id: null,
      color: null,
      state: "unpaired",
    });
    expect(
      Wristband.normalize({
        number: 5,
        color: 6,
      }),
    ).toMatchObject({
      id: 5,
      color: 6,
      state: "paired",
    });

    expect(
      Wristband.normalize({
        number: 0,
        color: 0,
      }),
    ).toMatchObject({
      id: 0,
      color: 0,
      state: "paired",
    });

    expect(
      Wristband.normalize({
        id: 3,
        color: 2,
      }),
    ).toMatchObject({
      id: 3,
      color: 2,
      state: "paired",
    });

    expect(
      Wristband.normalize({
        id: 0,
        color: 0,
      }),
    ).toMatchObject({
      id: 0,
      color: 0,
      state: "paired",
    });

    expect(
      Wristband.normalize({
        id: 3,
        color: 0,
        state: "registered",
      }),
    ).toMatchObject({
      id: 3,
      color: 0,
      state: "registered",
    });

    expect(Wristband.normalize(new Wristband())).toMatchObject({
      id: null,
      color: null,
      state: "unpaired",
    });

    expect(Wristband.normalize(new LiveWristband())).toMatchObject({
      id: null,
      color: null,
      state: "unpaired",
    });

    expect(
      Wristband.normalize(
        {
          id: 5,
        },
        "registered",
      ),
    ).toMatchObject({
      id: 5,
      color: null,
      state: "registered",
    });
  });
});
