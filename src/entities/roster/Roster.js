import { MAX_TEAM_SIZE } from "agent_factory.shared/constants.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { isArray, isObject } from "js_utils/misc";
import { Player } from "../player/index.js";

class Roster {
  static normalize(source, options) {
    if (source instanceof Roster) {
      source = source.asObject();
    } else if (isObject(source)) {
      source = source.roster || [];
    } else {
      source = isArray(source) ? source : [];
    }
    const target = [];
    for (let i = 0; i < source.length; i++) {
      target[i] = Player.normalize(source[i], options);
    }
    return target;
  }

  static random(source, options) {
    const target = [];
    for (let i = 0; i < source.length; i++) {
      target[i] = Player.random(source[i], options);
    }
    return target;
  }

  constructor(roster, createPlayer) {
    if (roster instanceof Roster) {
      roster = roster.asObject();
    } else if (isObject(roster)) {
      roster = roster.roster || [];
    } else {
      roster = isArray(roster) ? roster : [];
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
    this.set(roster);
  }

  get size() {
    return this.roster.size;
  }
}

Roster.prototype.fill = function (
  source = [],
  {
    state = "",
    defaultState = "",
    nulls = false,
    depth = 0,
    createPlayer,
  } = {},
) {
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
    } else if (this.size < MAX_TEAM_SIZE) {
      this.set(
        depth > 0
          ? createPlayer(
              Player.normalize([
                {
                  username: "player_#" + (i + 1),
                },
                source[i],
              ]),
            ).fill(null, { state, defaultState, nulls, depth: depth - 1 })
          : createPlayer(
              Player.normalize(
                [
                  {
                    username: "player_#" + (i + 1),
                  },
                  source[i],
                ],
                { state, defaultState, nulls },
              ),
            ),
      );
    } else {
      continue;
    }
  }
  const remainderSeats = MAX_TEAM_SIZE - this.size;
  for (let i = 0; i < remainderSeats; i++) {
    this.set(
      depth > 0
        ? createPlayer(
            Player.normalize([
              {
                username: "player_#" + (i + 1),
              },
              source[i],
            ]),
          ).fill(null, {
            state,
            defaultState,
            nulls,
            depth: depth - 1,
          })
        : createPlayer(
            Player.normalize(
              [
                {
                  username: "player_#" + (i + 1),
                },
                source[i],
              ],
              { state, defaultState, nulls },
            ),
          ),
    );
  }
  return this;
};

Roster.prototype.set = function (...players) {
  players = players.flat();
  const ln = players.length;
  for (let i = 0; i < ln; i++) {
    if (this.has(players[i]).username) {
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

Roster.prototype.log = function () {
  for (const player of this.roster.values()) {
    player.log();
  }
};

export { Roster };
