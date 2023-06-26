import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { addPackage } from "../../../../src/services/backend/api/addPackage.js";

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
  listPackages,
  registerPlayer,
  registerWristband,
  mergeTeam,
} from "../../../../src/services/backend/api/index.js";

let AVAILABLE_PACKAGES = [];
beforeAll(async () => {
  await backendClientService.init();
  await listPackages().then((res) => {
    AVAILABLE_PACKAGES = res.packages;
  });
});

describe("addPackage", () => {
  it("Should add a package to a team", async () => {
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
  });
  it("Should resolve with", async () => {
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

    let response;
    try {
      response = await addPackage({
        teamName,
        name: pkg,
      });
    } catch (err) {
      response = err;
    }

    expect(response).toMatchObject({ result: "OK" });
    expect(response.team).toMatchObject({
      name: teamName,
      totalPoints: 0,
      teamState: null,
      currentRoster: {
        version: 1,
        players: expect.any(Array),
      },
      roomType: null,
      packages: expect.any(Array),
    });
  });
  it.todo("Should validate the input", async () => {});
});
