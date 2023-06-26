import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { mergeGroupTeam } from "../../../../src/services/backend/api/mergeGroupTeam.js";

/*
  DEPENDENCIES
 */
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../../../scripts/randomWristband";
import { randomPlayer } from "../../../../scripts/randomPlayer.js";
import { emulateScan } from "../../../../scripts/emulateScan.js";
import { backendClientService } from "../../../../src/services/backend/client.js";
import * as Errors from "../../../../src/misc/errors.js";
import {
  registerPlayer,
  registerWristband,
} from "../../../../src/services/backend/api/index.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("mergeGroupTeam", async () => {
  it("Should merge a group team", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6, true); // unique colors
    const teamName = generateRandomName();

    await expect(
      mergeGroupTeam({
        teamName,
        groupPlayers: roster.map((p, i) => ({
          username: p.username,
          wristbandNumber: wristbands[i].number,
        })),
      })
    ).resolves.toMatchObject({ result: "OK" });
  });
});
