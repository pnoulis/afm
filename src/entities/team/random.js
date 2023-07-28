import { generateRandomName, randomInteger } from "js_utils/misc";
import { Roster } from "../roster/index.js";

function random(team = {}, depth = 2) {
  team ||= {};
  const __team = {
    name: team.name || generateRandomName(),
    points: team.points ?? randomInteger(),
    state: team.state || "unregistered",
    roster: new Roster().fill(team.roster, { depth }).asArray(),
  };
  return __team;
}

export { random };
