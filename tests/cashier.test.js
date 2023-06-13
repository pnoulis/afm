import { describe, it, expect, vi } from "vitest";
import { Cashier } from "../src/index.js";
import { randomPlayer } from "../scripts/randomPlayer.js";

const cashier = new Cashier();

describe("cashier", () => {
  it("Should be able to register a player", async () => {
    expect(cashier).toHaveProperty("registerPlayer");
    const newPlayer = randomPlayer();
    await expect(cashier.registerPlayer(newPlayer)).resolves.toMatchObject({
      result: "OK",
    });
  });

  it("Should throw an error if one tries to register the same player twice", async () => {
    const newPlayer = randomPlayer();
    await cashier.registerPlayer(newPlayer);
    await expect(cashier.registerPlayer(newPlayer)).rejects.toThrow(
      "This username already exists"
    );
  });
});
