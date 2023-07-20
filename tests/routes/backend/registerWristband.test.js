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
import { randomPlayer } from "agent_factory.shared/scripts/randomPlayer.js";
import { mapWristbandColor } from "agent_factory.shared/utils/misc.js";

let players;
const wristbands = randomWristband(3);
beforeAll(async () => {
  await flushBackendDB();
  await registerPlayer(3).then((res) => {
    players = res;
  });
});

describe("registerWristband", () => {
  it("it should register a players wristband", async () => {
    await expect(
      Afmachine.registerWristband({
        wristband: wristbands[0],
        player: players[0],
      }),
    ).resolves.toMatchObject(expect.any(Object));
  });
  it("Should resolve with primitves if given primitives as input", async () => {
    const response = await Afmachine.registerWristband({
      wristband: wristbands[1].number,
      player: players[1].username,
    });

    expect(response).toMatchObject({
      wristband: wristbands[1].number,
      player: players[1].username,
    });
  });

  it("Should resolve with objects if given objects as input", async () => {
    const response = await Afmachine.registerWristband({
      wristband: wristbands[2],
      player: players[2],
    });

    expect(response).toMatchObject({
      wristband: expect.objectContaining(wristbands[2]),
      player: expect.objectContaining(players[2]),
    });
  });
});
