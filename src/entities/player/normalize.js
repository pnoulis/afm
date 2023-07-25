import { Player } from "./Player.js";
import { Wristband } from "../wristband/Wristband.js";

/**
 * Normalize wristband to conform to frontend schema.
 * @param {Object...,string,string} args
 * @param {Object...,string} args
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

  let player = __normalize(sources.shift());

  // All sources are normalized and merged together. The order of execution is
  // the same used by Object.assign which uses a L to R direction. However
  // unlike Object.assign by default normalize() shall not allow falsy property
  // values to replace truthy property values unles the (opts.nulls = true).

  let source;
  if (opts.nulls) {
    while (sources.length) {
      source = __normalize(sources.shift());
      Object.assign(player, source);
    }
  } else {
    while (sources.length) {
      source = __normalize(sources.shift());
      player = {
        username: source.username || player.username,
        name: source.name || player.name,
        surname: source.surname || player.surname,
        email: source.email || player.email,
        password: source.password || player.password,
        state: source.state || player.state,
        wristband: source.wristband || player.wristband,
      };
    }
  }
  if (opts.state) {
    player.state = opts.state;
  }
  return player;
}

function __normalize(player = {}, state = "") {
  const __player = {
    name: player.name || "",
    username: player.username || "",
    surname: player.surname || "",
    email: player.email || "",
    password: player.password ?? "",
    wristband: Wristband.normalize(player.wristband),
  };
  let __state = "";

  if (state) {
    __state = state;
  } else if (Object.hasOwn(player, "wristbandMerged")) {
    if (player.wristbandMerged) {
      if (__player.wristband.state !== "unpaired") {
        __player.state = "inTeam";
      } else {
        throw new Error(
          "WristbandMerged true and player.wristband not paired.",
        );
      }
    } else if (__player.wristband.state !== "unpaired") {
      __player.state = "registered";
    } else {
      __player.state = "unregistered";
    }
    return __player;
  } else if (player instanceof Player) {
    __player.state = player.getState().name;
    return __player;
  } else if (typeof player.state === "string") {
    __state = player.state;
  } else if (__player.wristband.state !== "unpaired") {
    __player.state = "registered";
    return __player;
  } else {
    __player.state = "unregistered";
    return __player;
  }

  const lnStateNames = Player.states.length;
  for (let i = 0; i < lnStateNames; i++) {
    if (Player.states[i] === __state) {
      __player.state = __state;
      return __player;
    }
  }
  throw new Error(`Unrecognized player state ${__state}`);
}

export { normalize };
