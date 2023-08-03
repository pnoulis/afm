import { Team } from "../team/index.js";
import { generateRandomName } from "js_utils/misc";
import { extractTeams } from "../../utils/extractTeams.js";

/**
 * @example
 * [ GroupParty, GroupParty ]
 * @example
 * [ { name: "", roster: [], } { name: "", roster: []} ]
 * @example
 * [ Team, Team ]
 */
function normalize(sources, options = {}) {
  options ??= {
    state: "",
    defaultState: "",
    nulls: false,
  };
  const teams = extractTeams(sources);

  const matchingTeams = new Map();
  let team;
  for (let i = 0; i < teams.length; i++) {
    if (!(teams[i].name || teams[i].username)) {
      teams[i].name = generateRandomName();
    }
    let team = matchingTeams.get(teams[i].name || teams[i].teamName);
    if (team) {
      team.push(teams[i]);
    } else {
      matchingTeams.set(teams[i].name || teams[i].teamName, [teams[i]]);
    }
  }

  const normalizedTeams = [];
  for (const __ of matchingTeams.values()) {
    normalizedTeams.push(Team.normalize(__, options));
  }
  return normalizedTeams;
}

export { normalize };
