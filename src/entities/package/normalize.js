import { isArray } from "js_utils/misc";

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

function __normalize(source, { state = "", defaultState = "" } = {}) {
  source ??= {};
  const target = {
    id: source.id ?? null,
    name: source.name || "",
    amount: source.amount ?? 0,
    cost: source.cost ?? 0.0,
    started: source.started || null,
    ended: source.ended || null,
    duration: source.duration ?? null,
    paused: source.paused ?? false,
    missions: source.missions ?? null,
    missionsPlayed: source.missionsPlayed ?? null,
  };
  if (Object.hasOwn("missions", source)) {
    target.type = "mission";
  } else if (Object.hasOwn("duration", source)) {
    target.type = "time";
  } else {
    target.type = source.type;
  }
  return target;
}

export { normalize };
