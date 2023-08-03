import { Roster } from "../roster/Roster.js";
import { isArray } from "js_utils/misc";
import { extractTeams } from "../../utils/extractTeams.js";

/**
 * @example
 * [ { name, roster }, { name, roster } ]
 * @example
 * [ Team, Team ]
 */
function normalize(sources, options) {
  options ??= {
    state: "",
    defaultState: "",
    nulls: false,
  };
  const teams = extractTeams(sources);

  if (teams.length === 1) {
    return __normalize(teams[0], options);
  }

  let target = __normalize(
    {
      name: "",
      points: 0,
      roster: null,
      state: "unregistered",
    },
    options,
  );

  if (options.nulls) {
    while (teams.length) {
      Object.assign(target, __normalize(teams.shift()));
    }
  } else {
    let source = undefined;
    while (teams.length) {
      source = __normalize(teams.shift(), options);
      target = {
        name: source.name || target.name,
        points: source.points ?? target.points,
        state: source.state || target.state,
        roster: source.roster || target.roster,
      };
    }
  }
  return target;
}

function __normalize(source, { state = "", defaultState = "" }) {
  source ??= {};
  const target = {
    name: source.name || source.teamName || "",
    points: source.points ?? source.totalPoints ?? 0,
    roster: Roster.normalize(source.roster || source.currentRoster),
  };

  if (state) {
    target.state = state;
  } else if (source.teamState && /PACKAGE/.test(source.teamState)) {
    target.state = "merged";
  } else if (source.teamState) {
    target.state = "registered";
  } else if ("getState" in source) {
    target.state = source.getState().name;
  } else if (source.state) {
    target.state = source.state;
  } else if (defaultState) {
    target.state = defaultState;
  } else {
    target.state = "unregistered";
  }

  if (source.constructor?.states) {
    for (let i = 0; i < source.constructor.states.length; i++) {
      if (source.constructor.states[i] === target.state) {
        return target;
      }
    }
    throw new Error(`Unrecognized team state ${target.state}`);
  }
  return target;
}

export { normalize };
