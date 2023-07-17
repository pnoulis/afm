import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import * as ROUTES_BACKEND from "../../../src/routes/backend/routesBackend";

/*
  DEPENDENCIES
 */
import { backendClientService } from "../../../src/services/backend/client.js";
import { randomPlayer } from "../../../scripts/randomPlayer.js";
import { randomWristband } from "../../../scripts/randomWristband.js";
import { emulateScan } from "../../../scripts/emulateScan.js";
import { Player } from "../../../src/afmachine/player/index.js";
import { Wristband } from "../../../src/afmachine/wristband/index.js";
import { delay } from "js_utils/misc";
import * as Errors from "../../../src/misc/errors.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("getWristbandScan", () => {
  it("Should resolve with", async () => {
    let wristband = {
      number: 20,
      color: 6,
    };
    delay(2000).then(emulateScan(20, 2));
    const response = await ROUTES_BACKEND.getWristbandScan();
    expect(response).toMatchObject({
      number: 20,
      color: 2,
      active: false,
    });
  });
});
