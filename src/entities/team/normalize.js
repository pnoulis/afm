import { Team } from "./Team.js";
import { Roster } from "../roster/index.js";

function normalize(...sources) {
  const opts = {
    nulls:
      typeof sources.at(-1) === "boolean" ? sources.splice(-1).pop() : false,
    state: typeof sources.at(-1) === "string" ? sources.splice(-1).pop() : "",
  };

  if (sources.length < 2) {
    return __normalize(sources[0] || {}, opts.state);
  }

  let team = __normalize(sources.shift());
  // All sources are normalized and merged together. The order of execution is
  // the same used by Object.assign which uses a L to R direction. However
  // unlike Object.assign by default normalize() shall not allow falsy property
  // values to replace truthy property values unles the (opts.nulls = true).

  let source;
  if (opts.nulls) {
    while (sources.length) {
      source = __normalize(sources.shift());
      Object.assign(team, source);
    }
  } else {
    while (sources.length) {
      source = __normalize(sources.shift());
      team = {
        name: source.name || team.name,
        points: team.points ?? team.points,
        state: source.state ?? team.state,
        roster: source.roster ?? team.roster,
      };
    }
  }
  if (opts.state) {
    team.state = opts.state;
  }
  return team;
}

function __normalize(team, state = "") {
  team ??= {};
  const __team = {
    name: team.name || "",
    points: team.points ?? 0,
    roster: new Roster(team.roster).asArray(),
  };

  let __state = "";
  if (team.teamState && /PACKAGE/.test(team.teamState)) {
    __team.state = "merged";
    return __team;
  } else if (team.teamState) {
    __team.state = "registered";
    return __team;
  } else if (team instanceof Team) {
    __team.state = team.getState().name;
    return __team;
  } else if (typeof team.state === "string" && team.state) {
    __state = team.state;
  } else if (state) {
    __state = state;
  } else {
    __team.state = "unregistered";
    return __team;
  }

  const lnStateNames = Team.states.length;
  for (let i = 0; i < lnStateNames; i++) {
    if (Team.states[i] === __state) {
      __team.state = __state;
      return __team;
    }
  }
  throw new Error(`Unrecognized team state ${__state}`);
}

export { normalize };
