import { generateRandomName, randomInteger } from "js_utils/misc";
import { Roster } from "../roster/Roster.js";
import { extractTeams } from "../../utils/extractTeams.js";
import { MAX_TEAM_SIZE } from "agent_factory.shared/constants.js";

function random(source, { depth = 0, size = 0 } = {}) {
  const team = extractTeams(source).pop() || {};
  return {
    name: team.name || generateRandomName(),
    points: team.points ?? randomInteger(0, 500),
    roster:
      depth > 0
        ? Roster.random(team.roster, { depth: depth - 1, size })
        : Roster.normalize(team.roster),
    state: team.state || "unregistered",
  };
}

export { random };
