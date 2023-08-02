import { MAX_TEAM_SIZE } from "agent_factory.shared/constants.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { isArray, isObject } from "js_utils/misc";
import { Player } from "../player/index.js";

class Roster {
  static normalize(source, options) {
    if (source instanceof Roster) {
      source = source.asObject();
    } else if (isArray(source)) {
    } else if (isObject(source)) {
      source = source.roster || [];
    } else {
      source = [];
    }
    const target = [];
    for (let i = 0; i < MAX_TEAM_SIZE; i++) {
      target.push(Player.normalize(source[i], options));
    }
    return target;
  }

  static random(source, options) {
    source ??= [];
    options ??= {};
    const target = [];
    for (let i = 0; i < MAX_TEAM_SIZE; i++) {
      target[i] = Player.random(source[i], options);
    }
    return target;
  }

  constructor(roster, createPlayer) {
    if (roster instanceof Roster) {
      roster = roster.asObject();
    } else if (isArray(roster)) {
    } else if (isObject(roster)) {
      roster = roster.roster || [];
    } else {
      roster = [];
    }
    this.roster = new Map();
    this.createPlayer =
      createPlayer ||
      function (player) {
        return new Player(player);
      };

    for (let i = 0; i < roster.length; i++) {
      roster[i] = this.createPlayer(Player.normalize(roster[i]));
    }
    this.set(...roster);
  }

  get size() {
    return this.roster.size;
  }
}

Roster.prototype.fill = function (
  source = [],
  {
    size = MAX_TEAM_SIZE,
    state = "",
    defaultState = "",
    nulls = false,
    depth = 0,
    createPlayer,
  } = {},
) {
  size ??= MAX_TEAM_SIZE;
  createPlayer ??= this.createPlayer;
  if (!createPlayer) {
    throw new Error("createPlayer missing");
  }
  source = isArray(source) ? source : source?.roster || [];
  let occupiedSeat = null;

  for (let i = 0; i < source.length; i++) {
    occupiedSeat = this.get(source[i]?.username);

    if (occupiedSeat) {
      occupiedSeat.fill(Player.normalize(source[i]), {
        state,
        defaultState,
        nulls,
        depth: depth - 1,
      });
    } else if (this.size < size) {
      this.set(
        depth > 0
          ? createPlayer(Player.normalize([source[i]])).fill(null, {
              state,
              defaultState,
              nulls,
              depth: depth - 1,
            })
          : createPlayer(
              Player.normalize([source[i]], { state, defaultState, nulls }),
            ),
      );
    } else {
      continue;
    }
  }

  const values = this.asObject();
  const remainderSeats =
    size < this.size || MAX_TEAM_SIZE ? size : this.size || MAX_TEAM_SIZE;
  for (let i = 0; i < remainderSeats; i++) {
    this.set(
      depth > 0
        ? createPlayer(Player.normalize([values[i]])).fill(null, {
            state,
            defaultState,
            nulls,
            depth: depth - 1,
          })
        : createPlayer(
            Player.normalize([values[i]], { state, defaultState, nulls }),
          ),
    );
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
        this.createPlayer(Player.normalize(players[i])),
      );
      continue;
    }
    if (this.roster.size === MAX_TEAM_SIZE) {
      throw new aferrs.ERR_MAX_ROSTER_SIZE();
    }
    this.roster.set(
      players[i].username,
      this.createPlayer(Player.normalize(players[i])),
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
