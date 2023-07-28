import { MAX_TEAM_SIZE } from "agent_factory.shared/constants.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { isArray, isObject } from "js_utils/misc";
import { Player } from "../player/index.js";

class Roster {
  constructor(roster, createPlayer) {
    if (isObject(roster)) {
      roster = roster.roster || [];
    } else if (!isArray(roster)) {
      roster = [];
    }
    roster ??= [];
    this.roster = new Map();
    this.createPlayer =
      createPlayer ||
      function (player, options) {
        return new Player(player, options);
      };

    for (let i = 0; i < roster.length; i++) {
      roster[i] = this.createPlayer(Player.normalize(roster[i]));
    }
    this.set(roster);
  }

  get size() {
    return this.roster.size;
  }
  /**
   * Set roster players
   * @param {(Array.<Array>|Array.<Object>)} players
   * @throws {ERR_MAX_ROSTER_SIZE}
   */
  set(...players) {
    players = players.flat();
    const ln = players.length;
    for (let i = 0; i < ln; i++) {
      if (this.has(players[i]).username) {
        this.roster.set(players[i].username, players[i]);
        continue;
      }
      if (this.roster.size === MAX_TEAM_SIZE) {
        throw new aferrs.ERR_MAX_ROSTER_SIZE();
      }
      this.roster.set(players[i].username, players[i]);
    }
    return this;
  }

  /**
   * @example
   * No arguments -> Array of roster
   * roster.get without any parameters returns the whole roster
   * roster.get() -> [ Player1, Player2,... ]
   *
   * @example
   * One username -> Object of match
   * A string is interpreted as a players username. If a match is
   * found the Player is returned
   * roster.get("username") -> { ...Player }
   *
   * @example
   * Multiple usernames -> Array of matches
   * roster.get("username1", 'username2') -> [ Player1, Player2]

   * @example
   * One Player -> Object of match
   * roster.get({ username: "toehun"}) -> { ...Player}

   * @example
   * Multiple Players -> Array of matches
   * roster.get({username: "oeueou"}, { username: "toheunht"}) -> [ player1, Player2]

   */
  get(...players) {
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
  }

  /**
   * Remove roster players
   * @param {(Array.<Object>|Array.<string>|callback)} usernames
   * @param {Object} callback.player
   * @param {number} callback.index
   * @param {Array.<Object>} callback.roster
   * @returns {boolean} deleted
   */
  rm(...players) {
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
  }

  has(...players) {
    players = players.flat();
    const found = [];
    for (let i = 0; i < players.length; i++) {
      found[i] = this.roster.has(
        isObject(players[i]) ? players[i].username : players[i],
      );
    }
    return found.length > 1 ? found : found.pop();
  }

  /**
   * Find roster players
   * @param {callback} clause
   * @param {Object} clause.player
   * @param {number} clause.index
   * @param {Array.<Object>} clause.roster
   * @returns {(Array.<Object>|Object|Null)} players
   */
  find(clause) {
    const roster = Array.from(this.roster.values());
    const ln = roster.length;
    const found = [];
    for (let i = 0; i < ln; i++) {
      if (clause(roster[i], i, roster)) {
        found.push(roster[i]);
      }
    }
    return found.length > 0 ? found : null;
  }
}

Roster.prototype.fill = function (
  source = [],
  { state = "", depth = 0, createPlayer } = {},
) {
  createPlayer ??= this.createPlayer;
  if (!createPlayer) {
    throw new Error("createPlayer missing");
  }
  const players = isArray(source) ? source : source?.roster || [];
  let occupiedSeat = null;

  for (let i = 0; i < players; i++) {
    occupiedSeat = this.get(players[i]?.username);

    if (occupiedSeat) {
      occupiedSeat.fill(Player.normalize(players[i]), {
        state,
        depth: depth - 1,
      });
    } else if (this.size < MAX_TEAM_SIZE) {
      this.set(
        depth
          ? createPlayer(
              Player.normalize(
                {
                  username: "player_#" + (i + 1),
                },
                players[i],
              ),
            ).fill(undefined, {
              state,
              depth: depth - 1,
            })
          : createPlayer(
              Player.normalize(
                {
                  username: "player_#" + (i + 1),
                },
                players[i],
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
      depth
        ? createPlayer(
            Player.normalize(
              {
                username: "player_#" + (i + 1),
              },
              players[i],
            ),
          ).fill(undefined, {
            state,
            depth: depth - 1,
          })
        : createPlayer(
            Player.normalize(
              {
                username: "player_#" + (i + 1),
              },
              players[i],
            ),
          ),
    );
  }
  return this;
};

Roster.prototype.asArray = function (deep = true) {
  return deep
    ? Array.from(this.roster.values()).map((p) => p?.asObject())
    : Array.from(this.roster.values());
};

export { Roster };
