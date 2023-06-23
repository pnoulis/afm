import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { mergeTeam } from "../../../../src/services/backend/api/mergeTeam.js";

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

describe("mergeTeam", () => {
  it("Should merge a team", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6, true); // unique colors
    const teamName = generateRandomName();

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
  });
  it("Should respond with", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6, true); // unique colors
    const teamName = generateRandomName();

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

    let response;
    try {
      response = await mergeTeam({
        teamName,
        usernames: roster.map((_) => _.username),
      });
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "OK",
      message: `successfully created team: ${teamName}`,
    });
  });
  it.skip("Should validate the input", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6, true); // unique colors
    const teamName = generateRandomName();

    let response;

    // Missing payload
    try {
      response = await mergeTeam({});
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      message: expect.stringContaining("Cannot invoke"),
    });

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

    // Payload missing teamName
    try {
      response = await mergeTeam({
        usernames: roster.map((_) => _.username),
      });
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      validationErrors: {
        teamName: "empty",
      },
    });

    // Payload missing roster
    try {
      response = await mergeTeam({
        teamName: generateRandomName(),
      });
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      validationErrors: {
        usernames: expect.any(String),
      },
    });
  });
  // FAIL
  it.skip("Should require the roster to be of maximum size 6", async () => {
    const roster = randomPlayer(8);
    const wristbands = randomWristband(8);
    const teamName = generateRandomName();
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

    let response;
    try {
      response = await mergeTeam({
        teamName,
        usernames: roster.map((_) => _.username),
      });
    } catch (err) {
      response = err;
    }
  });
  // FAIL
  it.skip("Should require the roster to be of minimum size 2", async () => {
    const roster = randomPlayer(1);
    const wristband = randomWristband(1);
    const teamName = generateRandomName();

    await expect(registerPlayer(roster)).resolves.toMatchObject({
      result: "OK",
    });
    await expect(
      registerWristband({
        username: roster.username,
        wristbandNumber: wristband.number,
      })
    ).resolves.toMatchObject({ result: "OK" });

    let response;
    try {
      response = await mergeTeam({
        teamName,
        usernames: [roster.username],
      });
    } catch (err) {
      response = err;
    }
  });
  it("Should require all roster members to be registered", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6);
    const teamName = generateRandomName();

    // 4 registered players and 2 unregistered
    for (let i = 0; i < roster.length - 2; i++) {
      await expect(registerPlayer(roster[i])).resolves.toMatchObject({
        result: "OK",
      });
      await expect(
        registerWristband({
          username: roster[i].username,
          wristbandNumber: wristbands.pop().number,
        })
      ).resolves.toMatchObject({ result: "OK" });
    }
    let response;
    try {
      response = await mergeTeam({
        teamName,
        usernames: roster.map((_) => _.username),
      });
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      message: "at least one username doesn't exist",
    });
  });
  it("Should require all roster members to be paired with a wristband", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6);
    const teamName = generateRandomName();

    // 6 registered players, 5 registered wristbands
    for (const player of roster) {
      await expect(registerPlayer(player)).resolves.toMatchObject({
        result: "OK",
      });
      if (wristbands.length > 1) {
        await expect(
          registerWristband({
            username: player.username,
            wristbandNumber: wristbands.pop().number,
          })
        ).resolves.toMatchObject({ result: "OK" });
      }
    }

    let response;
    try {
      response = await mergeTeam({
        teamName,
        usernames: roster.map((_) => _.username),
      });
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      message: expect.stringMatching(
        /player with username.*hasn't register his wristband/
      ),
    });
  });
  // FAIL
  it.skip("Should require unique wristband colors across the roster", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6);
    const teamName = generateRandomName();

    // At least two wristbands with the same color.
    wristbands[0].color = wristbands[1].color;

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

    let response;
    try {
      response = await mergeTeam({
        teamName,
        usernames: roster.map((_) => _.username),
      });
    } catch (err) {
      response = err;
    }
    console.log(response);
    expect(response).toBeInstanceOf(Errors.ModelError);
  });
  it("Should require unique roster members", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6);
    const teamName = generateRandomName();

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

    // two same members
    roster[0] = roster[1];

    let response;
    try {
      response = await mergeTeam({
        teamName,
        usernames: roster.map((_) => _.username),
      });
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      message: expect.stringContaining("could not execute statement;"),
    });
  });
  it("Should require unique team names", async () => {
    const roster = randomPlayer(6);
    const wristbands = randomWristband(6);
    const teamName = generateRandomName();

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
    ).resolves.toMatchObject({
      result: "OK",
    });

    let response;
    try {
      response = await mergeTeam({
        teamName,
        usernames: roster.map((_) => _.username),
      });
    } catch (err) {
      response = err;
    }
    expect(response).toMatchObject({
      result: "NOK",
      message: "team with this name already exist",
    });
  });
});
