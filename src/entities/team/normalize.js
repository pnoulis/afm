import { Package } from "../package/index.js";
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
  sources ??= [];
  options ??= {
    state: "",
    defaultState: "",
    nulls: false,
  };
  const teams = extractTeams(sources);

  if (sources.length < 2) {
    return __normalize(sources[0], options);
  }
  let target = {};
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
        packages: source.packages || target.packages,
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
    roster: [],
    packages: source.packages?.map?.((p) => Package.normalize(p)) || [],
  };

  if (state) {
    target.state = state;
  } else if (source.teamState === "PACKAGE_RUNNING") {
    target.state = "playing";
  } else if (/PACKAGE/.test(source.teamState)) {
    target.state = "merged";
  } else if (Object.hasOwn(source, "teamState")) {
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
  if (target.state === "playing") {
    target.roster = Roster.normalize(
      source.roster || source?.currentRoster?.players,
      { state: "playing" },
    );
  } else {
    target.roster = Roster.normalize(
      source.roster || source?.currentRoster?.players,
      { state: "inTeam" },
    );
  }

  return target;
}

export { normalize };
