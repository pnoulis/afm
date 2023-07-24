import { Wristband } from "./Wristband.js";

function normalize(wristband = {}, state = "") {
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
    __wristband.state = wristband.active ? "registered" : "paired";
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
