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
import { registerWristband } from "agent_factory.shared/scripts/registerWristband.js";
import { flushBackendDB } from "agent_factory.shared/scripts/flushBackendDB.js";
import { randomWristband } from "agent_factory.shared/scripts/randomWristband.js";
import { randomPlayer } from "agent_factory.shared/scripts/randomPlayer.js";

let players;
beforeAll(async () => {
  await flushBackendDB();
  await registerWristband(6).then((res) => {
    players = res.map((p) => Player.normalize(p));
  });
});

describe("unregisterWristband", () => {
  it("Should unregister a wristband", async () => {
    await expect(
      Afmachine.unregisterWristband(players[0]),
    ).resolves.toMatchObject(expect.any(Object));
  });
  it("Should resolve with FPlayer", async () => {
    await expect(
      Afmachine.unregisterWristband(players[1]),
    ).resolves.toMatchObject({
      ...players[1],
      wristband: {
        ...Wristband.normalize(),
      },
    });
  });
  it.only("Should accept various payload formats", async () => {
    await expect(
      Afmachine.unregisterWristband({
        wristband: players[2].wristband.id,
        player: players[2].username,
      }),
    ).resolves.toMatchObject({
      username: players[2].username,
      wristband: Wristband.normalize(),
    });

    await expect(
      Afmachine.unregisterWristband({
        wristband: players[3].wristband,
        player: players[3],
      }),
    ).resolves.toMatchObject({
      ...players[3],
      wristband: Wristband.normalize(),
    });

    await expect(
      Afmachine.unregisterWristband(players[4]),
    ).resolves.toMatchObject({
      ...players[4],
      wristband: Wristband.normalize(),
    });
  });
});
