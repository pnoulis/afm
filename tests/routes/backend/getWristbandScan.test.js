import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/

import { Afmachine } from "../../../src/index.js";

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
  it("Should resolve with", async () => {
    const { number, color, active } = randomWristband();
    delay(2000).then(emulateScan.bind(null, number, color));
    const response = await Afmachine.getWristbandScan();

    expect(response).toMatchObject({
      number: number,
      colorCode: color,
      color: mapWristbandColor("colorCode", color),
      active: false,
    });
  });
});
