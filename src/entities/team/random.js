import { generateRandomName, randomInteger } from "js_utils/misc";
import { Roster } from "../roster/Roster.js";

function random(source = {}, { depth = 0 } = {}) {
  return {
    name: source.name || generateRandomName(),
    points: source.points ?? randomInteger(),
    roster:
      depth > 0 ? Roster.random(source.roster, { depth: depth - 1 }) : null,
    state: source.state || "unregistered",
  };
}

export { random };
