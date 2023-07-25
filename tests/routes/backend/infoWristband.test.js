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
  await registerWristband(3).then((res) => {
    players = res.map((p) => Player.normalize(p));
  });
});

describe("infoWristband", () => {
  it("Should retrieve information on a wristband", async () => {
    await expect(
      Afmachine.verifyWristband(Wristband.random()),
    ).resolves.toMatchObject(expect.any(Object));
  });
  it("Should respond with a FWristband", async () => {
    const w = Wristband.random();
    await expect(Afmachine.verifyWristband(w)).resolves.toMatchObject({
      id: w.id,
      color: w.color,
      state: "unpaired",
    });
  });
  it("Should accept various payload formats", async () => {
    await expect(
      Afmachine.verifyWristband(Wristband.random({ id: 5, color: 5 })),
    ).resolves.toMatchObject({
      id: 5,
      color: 5,
      state: "unpaired",
    });

    await expect(
      Afmachine.verifyWristband({
        wristband: Wristband.random({ id: 5, color: 5 }),
      }),
    ).resolves.toMatchObject({
      id: 5,
      color: 5,
      state: "unpaired",
    });

    await expect(
      Afmachine.verifyWristband(
        Player.random({ wristband: { id: 5, color: 5 } }, true),
      ),
    ).resolves.toMatchObject({
      id: 5,
      color: 5,
      state: "unpaired",
    });

    await expect(
      Afmachine.verifyWristband({ wristband: 5 }),
    ).resolves.toMatchObject({
      id: 5,
      color: null,
      state: "unpaired",
    });
  });
});
