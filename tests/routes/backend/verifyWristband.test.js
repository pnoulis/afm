import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/

import { Afmachine } from "../../../src/index.js";

/*
  DEPENDENCIES
 */
import { registerPlayer } from "agent_factory.shared/scripts/registerPlayer.js";
import { flushBackendDB } from "agent_factory.shared/scripts/flushBackendDB.js";
import { randomWristband } from "agent_factory.shared/scripts/randomWristband.js";
import { mapWristbandColor } from "agent_factory.shared/utils/misc.js";

describe("infoWristband", () => {
  it("Should retrieve information on a wristband", async () => {
    const wristband = randomWristband();
    await expect(Afmachine.verifyWristband(wristband)).resolves.toMatchObject(
      expect.any(Object),
    );
  });
  it("Should resolve with", async () => {
    const wristband = randomWristband();
    const response = await Afmachine.verifyWristband(wristband);
    expect(response).toMatchObject({
      number: wristband.number,
      colorCode: wristband.color,
      color: mapWristbandColor("colorCode", wristband.color),
      active: expect.any(Boolean),
    });
  });
});
