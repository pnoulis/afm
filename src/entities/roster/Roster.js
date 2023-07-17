import { MAX_TEAM_SIZE } from "agent_factory.shared/constants.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { isArray, isObject } from "js_utils/misc";

class Roster {
  constructor(...players) {
    this.roster = new Map();
    this.set(...(isArray(players[0]) ? players[0] : players));
  }

  /**
   * Set roster players
   * @param {(Array.<Array>|Array.<Object>)} players
   * @throws {ERR_MAX_ROSTER_SIZE}
   */
  set(...players) {
    players = isArray(players[0]) ? players[0] : players;
    for (let i = 0; i < players.length; i++) {
      if (this.roster.size > MAX_TEAM_SIZE - 1) {
        throw new aferrs.ERR_MAX_ROSTER_SIZE();
      }
      this.roster.set(players[i].username, players[i]);
    }
  }

  /**
   * Get roster players
   * @param {(Array.<Object>|Array.<string>)} usernames
   * @returns {(Array.<Object>|null)}
   */
  get(...usernames) {
    const found = [];
    for (let i = 0; i < usernames.length; i++) {
      found[i] = this.roster.get(
        isObject(usernames[i]) ? usernames[i].username : usernames[i],
      );
      if (!found[i]) return null;
    }
    return found;
  }

  /**
   * Remove roster players
   * @param {(Array.<Object>|Array.<string>|callback)} usernames
   * @param {Object} callback.player
   * @param {number} callback.index
   * @param {Array.<Object>} callback.roster
   * @returns {boolean} deleted
   */
  remove(...usernames) {
    if (typeof usernames[0] === "function") {
      usernames = this.find(usernames[0]);
      if (!usernames) return false;
    }
    let ln = usernames.length;
    let deleted = false;
    for (let i = 0; i < ln; i++) {
      deleted = this.roster.delete(
        isObject(usernames[i]) ? usernames[i].username : usernames[i],
      );
      if (!deleted) return false;
    }
    return deleted;
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

export { Roster };
