import { describe, it, expect, vi } from "vitest";
import { Player, Wristband } from "../src/index.js";
import * as Errors from "../src/errors.js";
import { randomWristband } from '../scripts/randomWristband.js';

const unregisterdPlayer = {};

const registeredPlayer = {
  registered: true,
  username: "something",
  name: "yolo",
  email: "yolo@gmail.com",
  password: "somepassword",
  wristbandMerged: false,
  wristband: {
    wristbandNumber: 10,
    wristbandColor: 6,
    active: true,
  },
};

const inTeamPlayer = {
  username: "something",
  name: "yolo",
  email: "yolo@gmail.com",
  password: "somepassword",
  wristbandMerged: true,
  wristband: {
    wristbandNumber: 10,
    wristbandColor: 6,
    active: true,
  },
};

const inGamePlayer = {
  inGame: true,
  username: "something",
  name: "yolo",
  email: "yolo@gmail.com",
  password: "somepassword",
  wristbandMerged: true,
  wristband: {
    wristbandNumber: 10,
    wristbandColor: 6,
    active: true,
  },
};

const playerUnregistered = new Player();
const playerRegistered = new Player(registeredPlayer);
const playerInTeam = new Player(inTeamPlayer);
const playerInGame = new Player(inGamePlayer);

describe("player", () => {
  it("Given an empty instantiation configuration go to state unregistered", () => {
    const p = new Player();
    expect(p.getState()).toBe("unregistered");
    expect(p.inState("unregistered")).toBe(true);
  });

  it("Given a registered instantiation configuration go to state Registered", () => {
    const p = new Player(registeredPlayer);
    expect(p.getState()).toBe("registered");
    expect(p.inState("registered")).toBe(true);
  });

  it("Given an inTeam instantiation configuration go to state inTeam", () => {
    const p = new Player(inTeamPlayer);
    expect(p.getState()).toBe("inTeam");
    expect(p.inState("inTeam")).toBe(true);
  });

  it("Given an inGame instantiation configuration go to state inGame", () => {
    const p = new Player(inGamePlayer);
    expect(p.getState()).toBe("inGame");
    expect(p.inState("inGame")).toBe(true);
  });

  it(
    "Should pairWristband() only when wristband is Empty and player NOT InGame", async () => {

      let player;
      let wristband;

      // unregistered player
      player = new Player();
      // empty wristband
      wristband = new Wristband();
      player.wristband = wristband;
      expect(player.getState()).toBe('unregistered');
      expect(wristband.getState()).toBe('empty');
      await expect(player.pairWristband()).resolves.toContain()
    }
  );
});
