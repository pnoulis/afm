import { isArray, isObject } from "js_utils/misc";

function extractTeams(sources) {
  if (!isArray(sources)) {
    sources = [sources];
  }

  const teams = [];
  let tmp;
  for (let i = 0; i < sources.length; i++) {
    tmp = sources[i]?.teams || sources[i];
    if (isArray(tmp)) {
      teams.push(...tmp);
    } else if (tmp && isObject(tmp)) {
      teams.push(tmp);
    } else {
      continue;
    }
  }
  return teams;
}

export { extractTeams };
