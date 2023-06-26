import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { removePackage } from "../../../../src/services/backend/api/removePackage.js";

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
  addPackage,
} from "../../../../src/services/backend/api/index.js";

let AVAILABLE_PACKAGES = [];
beforeAll(async () => {
  await backendClientService.init();
  await listPackages().then((res) => {
    AVAILABLE_PACKAGES = res.packages;
  });
});

describe("removePackage", () => {
  it("Should remove a package", async () => {
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
    const packageId = response.team.packages[0].id;
    await expect(
      removePackage({
        teamName,
        packageId,
      })
    ).resolves.toMatchObject({ result: "OK" });
  });
  it.todo("Should resolve with", async () => {});
});
