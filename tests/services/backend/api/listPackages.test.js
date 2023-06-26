import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { listPackages } from "../../../../src/services/backend/api/listPackages.js";

/*
  DEPENDENCIES
 */
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../../../scripts/randomWristband";
import { randomPlayer } from "../../../../scripts/randomPlayer.js";
import { emulateScan } from "../../../../scripts/emulateScan.js";
import { backendClientService } from "../../../../src/services/backend/client.js";
import * as Errors from "../../../../src/misc/errors.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("listPackages", () => {
  it("Should list packages", async () => {
    await expect(listPackages()).resolves.toMatchObject({ result: "OK" });
  });
  it("Should resolve with", async () => {
    let response;
    try {
      response = await listPackages();
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "OK",
      packages: expect.any(Array),
    });
    expect(response.packages.length).toBeGreaterThan(0);
  });
});
