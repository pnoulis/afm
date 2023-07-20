import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/

import { Afmachine } from "../../../src/index.js";

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
      Afmachine.registerPlayer(randomPlayer()),
    ).resolves.toMatchObject(expect.any(Object));
  });
  it("Should resolve with", async () => {
    const p = randomPlayer();
    const response = await Afmachine.registerPlayer(p);
    expect(response).toMatchObject({
      username: p.username,
      surname: p.surname,
      name: p.name,
      email: p.email,
    });
  });
});
