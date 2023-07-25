import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/

import { Afmachine } from "/src/index.js";
import { Player } from "/src/entities/player/index.js";

/*
  DEPENDENCIES
 */
import { flushBackendDB } from "agent_factory.shared/scripts/flushBackendDB.js";
import { randomPlayer } from "agent_factory.shared/scripts/randomPlayer.js";

beforeAll(async () => {
  await flushBackendDB();
});

describe("registerPlayer", () => {
  it("Should register a player", async () => {
    await expect(
      Afmachine.registerPlayer(Player.random()),
    ).resolves.toMatchObject(expect.any(Object));
  });
  it("Should resolve with an FPlayer", async () => {
    const p = Player.random();
    const response = await Afmachine.registerPlayer(p);
    expect(response).toMatchObject({
      ...p,
      state: "registered",
    });
  });
  it("Should accept various payload formats", async () => {
    let player = new Player().fill();
    await expect(Afmachine.registerPlayer(player)).resolves.toMatchObject({
      ...Player.normalize(player),
      state: "registered",
    });

    player = new Player().fill();
    await expect(
      Afmachine.registerPlayer({
        player,
      }),
    ).resolves.toMatchObject({
      ...Player.normalize(player),
      state: "registered",
    });
  });
});
