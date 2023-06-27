import Pino from "pino";
import { detectRuntime, detectMode, getEnvar } from "js_utils/environment";

// CONFIGURE ENVIRONMENT
const RUNTIME = detectRuntime();
if (RUNTIME === "node") {
  Object.defineProperty(import.meta, "env", {
    enumerable: true,
    value: {},
  });
}

const ENVIRONMENT = {
  RUNTIME,
  MODE: detectMode(),
  LOGLEVEL: getEnvar("LOGLEVEL", true, import.meta.env.LOGLEVEL),
  BACKEND_CLIENT_ID: getEnvar("BACKEND_CLIENT_ID", true, "dev001"),
  BACKEND_ROOM_NAME: getEnvar("BACKEND_ROOM_NAME", true, "registration5"),
  BACKEND_DEVICE_TYPE: getEnvar(
    "BACKEND_DEVICE_TYPE",
    true,
    "REGISTRATION_SCREEN"
  ),
  BACKEND_URL: getEnvar("BACKEND_URL", true, import.meta.env.BACKEND_URL),
  BACKEND_AUTH_USERNAME: getEnvar(
    "BACKEND_AUTH_USERNAME",
    false,
    import.meta.env.BACKEND_AUTH_USERNAME
  ),
  BACKEND_AUTH_PASSWORD: getEnvar(
    "BACKEND_AUTH_PASSWORD",
    false,
    import.meta.env.BACKEND_AUTH_PASSWORD
  ),
};

// CONFIGURE LIB_MQTT
let LIB_MQTT = undefined;
if (ENVIRONMENT.RUNTIME === "node") {
  LIB_MQTT = await import("mqtt");
} else {
  LIB_MQTT = await import("precompiled-mqtt");
}

// CONFIGURE LOGGER
const LOGGER = new Pino({
  level: ENVIRONMENT.LOGLEVEL,
  name: "Afmachine",
  base: undefined,
  timestamp: Pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  browser: ENVIRONMENT.RUNTIME === "browser" ? { asObject: true } : undefined,
});

// log ENVIRNOMENT
console.log(ENVIRONMENT);
export { ENVIRONMENT, LIB_MQTT, LOGGER };
