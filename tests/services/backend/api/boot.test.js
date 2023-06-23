import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { boot } from "../../../../src/services/backend/api/boot.js";

/*
  DEPENDENCIES
 */
import { ENVIRONMENT } from "../../../../src/config.js";
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../../../scripts/randomWristband";
import { randomPlayer } from "../../../../scripts/randomPlayer.js";
import { emulateScan } from "../../../../scripts/emulateScan.js";
import { backendProxy } from "../../../../src/services/backend/client.js";
import * as Errors from "../../../../src/misc/errors.js";

describe("boot", () => {
  it("Should boot", async () => {
    await expect(
      boot({
        deviceId: ENVIRONMENT.BACKEND_CLIENT_ID,
        roomName: ENVIRONMENT.BACKEND_ROOM_NAME,
        deviceType: ENVIRONMENT.BACKEND_DEVICE_TYPE,
      })
    ).resolves.toMatchObject({ result: "OK" });
  });
  it("Should resolve with", async () => {
    const response = await boot({
      deviceId: ENVIRONMENT.BACKEND_CLIENT_ID,
      roomName: ENVIRONMENT.BACKEND_ROOM_NAME,
      deviceType: ENVIRONMENT.BACKEND_DEVICE_TYPE,
    });
    expect(response).toMatchObject({
      result: "OK",
      deviceType: "REGISTRATION_SCREEN",
      roomName: "registration5",
    });
  });
  it("Should validate the input", async () => {
    let response;

    // empty payload
    try {
      response = await boot({});
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      validationErrors: expect.any(Object),
    });
  });
});
