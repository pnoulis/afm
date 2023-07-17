import { detectRuntime, detectMode, getEnvar } from "js_utils/environment";

const RUNTIME = detectRuntime();

/*
  __ENV__ scope problem.

  Image a situation where lib A depends on lib B.

  Lib B uses a bundler to gather its surface area into a single file while at
  the same time statically replacing MACROS such as __ENV__.

  Lib A also depends on the same MACRO __ENV__.

*/

if (typeof __STATIC_ENV__ !== "undefined") {
  // Means application is running within a browser and __STATIC_ENV__ has been
  // statically defined by a macro preprocessor.
  globalThis.__ENV__ = __STATIC_ENV__;
} else if (RUNTIME === "node") {
  const { loadenv } = await import("js_utils/node/loadenv");
  globalThis.__ENV__ = {};
  loadenv(null, globalThis.__ENV__);
} else {
  throw new Error("config.js failed to load __ENV__");
}

const ENVIRONMENT = {
  RUNTIME,
  MODE: detectMode(),
  LOGLEVEL: getEnvar("LOGLEVEL", false, "debug"),
};

export { ENVIRONMENT };
