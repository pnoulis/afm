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

beforeAll(async () => {
  await flushBackendDB();
  await registerPlayer({ username: "test1" }, { username: "test2" });
});

describe("searchPlayers", () => {
  it("Should search for players", async () => {
    await expect(
      Afmachine.searchPlayer({ searchTerm: "test" }),
    ).resolves.toMatchObject(expect.any(Object));
  });
  it("Should resolve with", async () => {
    const response = await Afmachine.searchPlayer({ searchTerm: "test" });

    expect(response).toBeInstanceOf(Array);
    expect(response).toHaveLength(2);
    expect(response).toMatchObject([
      {
        username: "test1",
      },
      {
        username: "test2",
      },
    ]);
    console.dir(response, { depth: null });
  });
});
