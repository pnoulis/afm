import { isArray } from "js_utils/misc";
import { stoms } from "../../utils/misc.js";

function normalize(sources, options) {
  sources ??= [];
  if (!isArray(sources)) {
    sources = [sources];
  }
  options ??= {
    state: "",
    defaultState: "",
    nulls: false,
  };

  if (sources.length < 2) {
    return __normalize(sources[0], options);
  }

  let target;
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
        type: source.type || target.type,
        amount: source.amount ?? target.amount,
        cost: source.cost ?? target.cost,
      };
    }
  }
  return target;
}

function __normalize(source, { state = "", defaultState = "", pkgs } = {}) {
  source ??= {};
  const target = {
    id: source.id ?? null,
    name: source.name || "",
    t_start: source.t_start ?? source.started ?? null,
    t_end: source.t_end ?? source.ended ?? null,
  };

  // calculate cost
  if (source.cost) {
    target.cost = source.cost ?? null;
  } else if (pkgs?.length > 0 && source.name) {
    target.cost = pkgs.find((p) => p.name === source.name)?.cost || null;
  } else {
    target.cost = source.cost ?? null;
  }

  // The missions or durations property mean this source
  // is coming from the backend
  if (Object.hasOwn(source, "missions")) {
    target.type = "mission";
    target.amount = source.missions ?? 0;
    target.remainder = target.amount - source.missionsPlayed;
    var __state;
    if (!target.remainder) {
      __state = "completed";
      if (!target.t_end) {
        target.t_end = Date.now();
      }
    } else {
      __state = "registered";
    }
  } else if (Object.hasOwn(source, "duration")) {
    target.type = "time";
    const now = Date.now();
    target.amount = stoms(source.duration ?? 0);
    target.remainder = now - ((target.started || now) + target.amount);
    target.remainder = target.remainder < 0 ? Math.abs(target.remainder) : 0;
    var __state;
    if (!target.remainder) {
      __state = "completed";
      if (!target.t_end) {
        target.t_end = now;
      }
    } else {
      __state = "registered";
    }
  } else {
    target.type = source.type || "";
    target.amount = source.amount ?? null;
    target.remainder = source.remainder ?? null;
  }

  if (state) {
    target.state = state;
  } else if (source.active) {
    target.state = "playing";
  } else if (source.paused) {
    target.state = "paused";
  } else if (__state) {
    target.state = __state;
  } else if ("getState" in source) {
    target.state = source.getState().name;
  } else if (source.state) {
    target.state = source.state;
  } else if (defaultState) {
    target.state = defaultState;
  } else {
    target.state = "new";
  }

  if (source.constructor?.states) {
    for (let i = 0; i < source.constructor.states.length; i++) {
      if (source.constructor.states[i] === target.state) {
        return target;
      }
    }
    throw new Error(`Unrecognized package state ${target.state}`);
  }
  return target;
}

export { normalize };
