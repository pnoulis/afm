import { Wristband } from "./Wristband.js";
import { isObject } from "js_utils/misc";

/**
 * Normalize wristband to conform to frontend schema.
 * @param {Object...,string,string} Objects
 * @param {Object...,string} Objects
 *
 */
function normalize(...sources) {
  const opts = {
    nulls:
      typeof sources.at(-1) === "boolean" ? sources.splice(-1).pop() : false,
    state: typeof sources.at(-1) === "string" ? sources.splice(-1).pop() : "",
  };

  if (sources.length < 2) {
    return __normalize(sources[0], opts.state);
  }

  let wristband = __normalize(sources.shift());

  // All sources are normalized and merged together. The order of execution is
  // the same used by Object.assign which uses a L to R direction. However
  // unlike Object.assign by default normalize() shall not allow falsy property
  // values to replace truthy property values unles the (opts.nulls = true).

  let source;
  if (opts.nulls) {
    while (sources.length) {
      source = __normalize(sources.shift());
      Object.assign(wristband, source);
    }
  } else {
    while (sources.length) {
      source = __normalize(sources.shift());
      wristband = {
        id: source.id ?? wristband.id,
        color: source.color ?? wristband.color,
        state: source.state || wristband.state,
      };
    }
  }
  if (opts.state) {
    wristband.state = opts.state;
  }
  return wristband;
}

function __normalize(wristband = {}, state = "") {
  const __wristband = {
    id: wristband.id ?? wristband.wristbandNumber ?? wristband.number ?? null,
    color: null,
  };

  if (__wristband.id === null) {
    __wristband.state = "unpaired";
    return __wristband;
  } else {
    __wristband.color = wristband.color ?? wristband.wristbandColor ?? null;
  }

  let __state = "";

  if (state) {
    __state = state;
  } else if (Object.hasOwn(wristband, "active")) {
    __wristband.state = wristband.active ? "paired" : "unpaired";
    return __wristband;
  } else if (wristband instanceof Wristband) {
    __wristband.state = wristband.getState().name;
    return __wristband;
  } else if (typeof wristband.state === "string") {
    __state = wristband.state;
  } else {
    __wristband.state = "paired";
    return __wristband;
  }

  const lnStateNames = Wristband.states.length;
  for (let i = 0; i < lnStateNames; i++) {
    if (Wristband.states[i] === __state) {
      __wristband.state = __state;
      return __wristband;
    }
  }
  throw new Error(`Unrecognized wristband state ${__state}`);
}

export { normalize };
