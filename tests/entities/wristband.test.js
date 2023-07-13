import { describe, it, expect, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
 */

import { Wristband2 } from "../../src/entities/wristband/Wristband2.js";

/*
  DEPENDENCIES
 */
import { emulateScan } from "agent_factory.shared/scripts/emulateScan.js";
import { delay } from "js_utils/misc";

const wristbands = [new Wristband2(), new Wristband2(), new Wristband2()];

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
});
