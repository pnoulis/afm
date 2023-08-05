import { Wristband } from "../wristband/index.js";
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
      Object.assign(target, __normalize(sources.shift(), options));
    }
  } else {
    let source = undefined;
    while (sources.length) {
      source = __normalize(sources.shift(), options);
      target = {
        username: source.username || target.username,
        name: source.name || target.name,
        surname: source.surname || target.surname,
        email: source.email || target.email,
        password: source.password || target.password,
        state: source.state || target.state,
        wristband: source.wristband || target.wristband,
      };
    }
  }
  return target;
}

function __normalize(source, { state = "", defaultState = "" } = {}) {
  source ??= {};
  const target = {
    name: source.name || "",
    username: source.username || "",
    surname: source.surname || "",
    email: source.email || "",
    password: source.password ?? "",
  };

  if (state) {
    target.state = state;
  } else if (source.wristbandMerged) {
    target.state = "inTeam";
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
    throw new Error(`Unrecognized player state ${target.state}`);
  }

  if (target.state !== "unregistered") {
    target.wristband = Wristband.normalize(
      source.wristband || {
        wristbandNumber: source.wristbandNumber,
        wristbandColor: source.wristbandColor,
      },
      { state: "paired" },
    );
    if (target.wristband.id === null) {
      target.wristband.state = "unpaired";
    }
  } else {
    target.wristband = Wristband.normalize(
      source.wristband || {
        wristbandNumber: source.wristbandNumber,
        wristbandColor: source.wristbandColor,
      },
      { state: "unpaired" },
    );
  }

  return target;
}

export { normalize };
