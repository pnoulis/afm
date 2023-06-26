import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { startTeam } from "../../../../src/services/backend/api/startTeam.js";

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
  mergeGroupTeam,
  registerPlayer,
  registerWristband,
  mergeTeam,
  addPackage,
  listPackages,
} from "../../../../src/services/backend/api/index.js";

let AVAILABLE_PACKAGES = [];
beforeAll(async () => {
  await backendClientService.init();
  await listPackages().then((res) => {
    AVAILABLE_PACKAGES = res.packages;
  });
});

describe("startTeam", () => {
  it("Should start a team", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6, true); // unique colors
    const teamName = generateRandomName();
    const pkg = AVAILABLE_PACKAGES[0].name;

    for (const player of roster) {
      await expect(registerPlayer(player)).resolves.toMatchObject({
        result: "OK",
      });
      await expect(
        registerWristband({
          username: player.username,
          wristbandNumber: wristbands.pop().number,
        })
      ).resolves.toMatchObject({ result: "OK" });
    }

    await expect(
      mergeTeam({
        teamName,
        usernames: roster.map((_) => _.username),
      })
    ).resolves.toMatchObject({ result: "OK" });

    await expect(
      addPackage({
        teamName,
        name: pkg,
      })
    ).resolves.toMatchObject({ result: "OK" });

    await expect(
      startTeam({
        teamName,
      })
    ).resolves.toMatchObject({ result: "OK" });
  });

  it("Should start a group team", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6, true); // unique colors
    const teamName = generateRandomName();
    const pkg = AVAILABLE_PACKAGES[0].name;

    await expect(
      mergeGroupTeam({
        teamName,
        groupPlayers: roster.map((p, i) => ({
          username: p.username,
          wristbandNumber: wristbands[i].number,
        })),
      })
    ).resolves.toMatchObject({ result: "OK" });

    await expect(
      addPackage({
        teamName,
        name: pkg,
      })
    ).resolves.toMatchObject({ result: "OK" });

    await expect(
      startTeam({
        teamName,
      })
    ).resolves.toMatchObject({ result: "OK" });
  });
});
