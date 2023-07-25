import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/

import { Afmachine } from "../../../src/index.js";
import { Player } from "/src/entities/player/index.js";
import { Wristband } from "/src/entities/wristband/index.js";

/*
  DEPENDENCIES
 */
import { registerPlayer } from "agent_factory.shared/scripts/registerPlayer.js";
import { flushBackendDB } from "agent_factory.shared/scripts/flushBackendDB.js";
import { randomWristband } from "agent_factory.shared/scripts/randomWristband.js";
import { randomPlayer } from "agent_factory.shared/scripts/randomPlayer.js";
import { mapWristbandColor } from "agent_factory.shared/utils/misc.js";

let players;
const wristbands = randomWristband(5).map((w) => Wristband.normalize(w));
beforeAll(async () => {
  await flushBackendDB();
  await registerPlayer(5).then((res) => {
    players = res.map((p) => Player.normalize(p, "registered"));
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
  it("Should resolve with an FPlayer", async () => {
    const response = await Afmachine.registerWristband({
      wristband: wristbands[1],
      player: players[1],
    });

    expect(response).toMatchObject({
      ...players[1],
      wristband: {
        ...wristbands[1],
        state: "registered",
      },
    });
  });

  it("Should accept various payload formats", async () => {
    await expect(
      Afmachine.registerWristband({
        wristband: wristbands[2].id,
        player: players[2].username,
      }),
    ).resolves.toMatchObject({
      username: players[2].username,
      wristband: {
        id: wristbands[2].id,
        state: "registered",
      },
    });

    await expect(
      Afmachine.registerWristband({
        wristband: wristbands[3],
        player: players[3],
      }),
    ).resolves.toMatchObject({
      ...players[3],
      wristband: {
        ...wristbands[3],
        state: "registered",
      },
    });

    const p = Player.normalize(
      new Player(players[4]).fill(undefined, { depth: 1 }),
    );
    await expect(Afmachine.registerWristband(p)).resolves.toMatchObject({
      ...p,
      wristband: {
        ...p.wristband,
        state: "registered",
      },
    });
  });
});
