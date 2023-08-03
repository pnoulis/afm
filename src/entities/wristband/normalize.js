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

  if (sources.length === 1) {
    return __normalize(sources[0], options);
  }

  let target = __normalize(
    {
      id: null,
      color: null,
      state: "unpaired",
    },
    options,
  );

  if (options.nulls) {
    while (sources.length) {
      Object.assign(target, __normalize(sources.shift()));
    }
  } else {
    let source = undefined;
    while (sources.length) {
      source = __normalize(sources.shift(), options);
      target = {
        id: source.id ?? target.id,
        color: source.color ?? target.color,
        state: source.state || target.state,
      };
    }
  }
  return target;
}

function __normalize(source, { state = "", defaultState = "" } = {}) {
  source ??= {};
  const target = {
    id: source.id ?? source.wristbandNumber ?? source.number ?? null,
    color: source.color ?? source.wristbandColor ?? null,
    state: "",
  };
  if (state) {
    target.state = state;
  } else if (Object.hasOwn(source, "active")) {
    target.state = source.active ? "paired" : "unpaired";
  } else if ("getState" in source) {
    target.state = source.getState().name;
  } else if (source.state) {
    target.state = source.state;
  } else if (defaultState) {
    target.state = defaultState;
  } else {
    target.state = "unpaired";
  }
  if (source.constructor?.states) {
    for (let i = 0; i < source.constructor.states.length; i++) {
      if (source.constructor.states[i] === target.state) {
        return target;
      }
    }
    throw new Error(`Unrecognized wristband state ${target.state}`);
  }
  return target;
}

export { normalize };
