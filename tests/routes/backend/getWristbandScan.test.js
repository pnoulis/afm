import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/

import { Afmachine } from "../../../src/index.js";
import { Wristband } from "/src/entities/wristband/index.js";

/*
  DEPENDENCIES
 */
import { randomWristband } from "agent_factory.shared/scripts/randomWristband.js";
import { emulateScan } from "agent_factory.shared/scripts/emulateScan.js";
import { delay } from "js_utils/misc";
import { mapWristbandColor } from "agent_factory.shared/utils/misc.js";

describe("getWristbandScan", () => {
  it("Should scan a wristband", async () => {
    delay(2000).then(emulateScan);
    await expect(Afmachine.getWristbandScan()).resolves.toMatchObject(
      expect.any(Object),
    );
  });
  it.only("Should resolve with an FWristband", async () => {
    const w = Wristband.random();
    delay(2000).then(emulateScan.bind(null, w.id, w.color));
    const response = await Afmachine.getWristbandScan();
    expect(response).toMatchObject({
      id: w.id,
      color: w.color,
      state: "paired",
    });
  });
});
