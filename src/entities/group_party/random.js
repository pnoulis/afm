import { Roster } from "../roster/index.js";
import { Player } from "../player/index.js";
import { Team } from "../team/index.js";
import { GroupParty } from "./GroupParty.js";
import { isArray, isObject } from "js_utils/misc";
import { extractTeams, extractPlayers } from "../../utils/index.js";
import { MAX_TEAM_SIZE } from "agent_factory.shared/constants.js";

/**
 * @example
 *  groupparty } groupparty
 * @example
 * [ { name: roster } { name: roster: } ] array of teams
 * @example
 * [ { username } ] array of players mixed arrayf of teams or players
 */

function random(source, { depth = 0, size = 0 } = {}) {
  const teams = extractTeams(source);
  const players = extractPlayers(teams);

  if (size < players.length) {
    size = players.length;
  }

  let team = 0;
  let player;
  let __teams = [];
  for (let i = 0; i < size; i++) {
    if (__teams[team] == null) {
      __teams[team] = { ...teams.shift(), roster: [] };
    } else if (__teams[team].roster.length === MAX_TEAM_SIZE) {
      __teams[++team] = { ...teams.shift(), roster: [] };
    }
    __teams[team].roster.push(Player.random(players.shift()));
  }
  return __teams.map((t) => Team.random(t));
}

export { random };
