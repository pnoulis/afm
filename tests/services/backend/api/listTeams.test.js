import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { listTeams } from "../../../../src/services/backend/api/listTeams.js";

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

describe("list teams", () => {
  it("Should list teams", async () => {
    await expect(listTeams()).resolves.toMatchObject({ result: "OK" });
  });
  it("Should resolve with", async () => {
    let response;
    try {
      response = await listTeams();
    } catch (err) {
      response = err;
    }
    expect(response.result).toEqual("OK");
    expect(response).toHaveProperty("teams");
    expect(response.teams).toBeInstanceOf(Array);
  });
});
