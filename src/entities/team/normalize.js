import { Roster } from "../roster/Roster.js";

function normalize(sources, options) {
  sources ??= [];
  if (!Array.isArray(sources)) {
    sources = [sources];
  }
  options ??= {
    state: "",
    defaultState: "",
    nulls: false,
  };

  if (sources.length === 1) {
    return __normalize(sources[0], options);
  }

  let target = {
    name: "",
    points: 0,
    roster: [],
    state: "unregistered",
  };

  if (options.nulls) {
    while (sources.length) {
      Object.assign(target, __normalize(sources.shift()));
    }
  } else {
    let source = undefined;
    while (sources.length) {
      source = __normalize(sources.shift(), options);
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
    name: source.name || "",
    points: source.points ?? 0,
    roster: Roster.normalize(source.roster),
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
