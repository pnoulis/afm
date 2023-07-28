import { PlayerWristband } from "../wristband/index.js";
import { generateRandomName, randomInteger } from "js_utils/misc";
import { smallid } from "js_utils/uuid";
import { Player } from "../player/index.js";
import { Roster } from "../roster/index.js";

function random(team = {}, depth = 2) {
  team ||= {};
  const __team = {
    name: team.name || generateRandomName(),
    points: team.points ?? randomInteger(),
    state: team.state || "unregistered",
    roster: new Roster().fill(team, { depth }).asArray(),
  };
  return __team;
}

export { random };
