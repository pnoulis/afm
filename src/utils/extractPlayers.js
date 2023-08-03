import { Roster } from "../entities/roster/index.js";
import { isObject, isArray } from "js_utils/misc";

function extractPlayers(sources = []) {
  if (!isArray(sources)) {
    sources = [sources];
  }
  const players = [];
  let tmp;
  for (let i = 0; i < sources.length; i++) {
    tmp = sources[i]?.roster ?? sources[i];
    if (tmp instanceof Roster) {
      players.push(...tmp.asObject());
    } else if (tmp instanceof Map) {
      players.push(...sources[i].asObject());
    } else if (isArray(tmp)) {
      players.push(...tmp);
    } else if (isObject(tmp)) {
      players.push(tmp);
    } else {
      continue;
    }
  }
  return players;
}

export { extractPlayers };
