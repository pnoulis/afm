import { MAX_TEAM_SIZE } from "agent_factory.shared/constants.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { isArray, isObject } from "js_utils/misc";
import { Player } from "../player/index.js";
import { smallid } from "js_utils/uuid";
import { normalize } from "./normalize.js";
import { random } from "./random.js";

class Roster {
  static normalize = normalize;
  static random = random;

  constructor(roster, createPlayer) {
    roster ??= [];
    this.roster = new Map();
    this.createPlayer =
      createPlayer ||
      function (player) {
        return new Player(player);
      };

    roster = Roster.normalize(roster);
    this.roster = new Map(
      roster.map((player) => [player.username, this.createPlayer(player)]),
    );
    if (this.roster.size > MAX_TEAM_SIZE) {
      this.rm();
      throw new aferrs.ERR_MAX_ROSTER_SIZE();
    }
  }

  get size() {
    return this.roster.size;
  }
}

Roster.prototype.fill = function (
  source,
  {
    size = MAX_TEAM_SIZE,
    state = "",
    defaultState = "",
    nulls = false,
    depth = 0,
    createPlayer,
  } = {},
) {
  source ??= [];
  if (size < source.length) {
    size = source.length;
  }
  const target = Roster.random(
    Roster.normalize([this, source], {
      state,
      defaultState,
      nulls,
      depth,
    }),
    { depth, size },
  );

  this.roster = new Map(
    target.map((player) => [player.username, this.createPlayer(player)]),
  );
  if (this.roster.size > MAX_TEAM_SIZE) {
    this.rm();
    throw new aferrs.ERR_MAX_ROSTER_SIZE();
  }
  return this;
};

Roster.prototype.set = function (...players) {
  players = players.flat();
  const ln = players.length;
  for (let i = 0; i < ln; i++) {
    if (this.has(players[i])) {
      this.roster.set(
        players[i].username,
        this.createPlayer(Player.normalize([players[i]])),
      );
      continue;
    }
    if (this.roster.size === MAX_TEAM_SIZE) {
      throw new aferrs.ERR_MAX_ROSTER_SIZE();
    }

    this.roster.set(
      players[i].username,
      this.createPlayer(Player.normalize([players[i]])),
    );
  }
  return this;
};

Roster.prototype.get = function (...players) {
  players = players.flat();
  if (!players.length) {
    return Array.from(this.roster.values());
  }
  const found = [];
  for (let i = 0; i < players.length; i++) {
    found[i] = this.roster.get(
      isObject(players[i]) ? players[i].username : players[i],
    );
  }
  return found.length > 1 ? found : found.pop();
};

Roster.prototype.rm = function (...players) {
  players = players.flat();
  if (typeof players[0] === "function") {
    players = this.find(players[0]);
    if (!players) return false;
  }
  if (!players.length) {
    players = Array.from(this.roster.keys());
  }
  const deleted = [];
  for (let i = 0; i < players.length; i++) {
    deleted[i] = this.roster.delete(
      isObject(players[i]) ? players[i].username : players[i],
    );
  }
  return deleted.length > 1 ? deleted : deleted.pop();
};

Roster.prototype.has = function (...players) {
  players = players.flat();
  const found = [];
  for (let i = 0; i < players.length; i++) {
    found[i] = this.roster.has(
      isObject(players[i]) ? players[i].username : players[i],
    );
  }
  return found.length > 1 ? found : found.pop();
};
Roster.prototype.find = function (clause) {
  const roster = Array.from(this.roster.values());
  const ln = roster.length;
  const found = [];
  for (let i = 0; i < ln; i++) {
    if (clause(roster[i], i, roster)) {
      found.push(roster[i]);
    }
  }
  return found.length > 0 ? found : null;
};
Roster.prototype.asObject = function () {
  return Array.from(this.roster.values()).map((p) => p?.asObject());
};
Roster.prototype.forEachAsync = async function (cb) {
  for (const v of this.roster.values()) {
    await cb(v);
  }
};
Roster.prototype.forEach = function (cb) {
  for (const v of this.roster.values()) {
    cb(v);
  }
};
Roster.prototype.log = function () {
  for (const player of this.roster.values()) {
    player.log();
  }
};

export { Roster };
