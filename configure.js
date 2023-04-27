import Pino from "pino";
import { MqttProxy } from "mqtt_proxy";
import { detectRuntime, detectMode, getEnvar } from "js_utils";
import { toClient as BACKEND_TOPICS } from "agent_factory.shared/backend_topics.js";
import { backendService } from "./src/services/index.js";
import { AgentFactoryMachine } from "./src/afm.js";

/*
  configure:

  - Logger
     logger

  - Mqtt Backend Client that communicates to the backend server service
     backendMqttClient

  - Mqtt Proxy through which the backendMqttClient is used
     backendMqttClientProxy

  - Backend service
     backendService

     Both backendMqttClient and backendMqttClientProxy are provided
     to the backendService

  - Data store for state persistence
     store

  - Agent factory machine
     Afmachine

     The Afmachine is provided:
        1. logger
        2. backendService.js
        3. store
 */

const CONFIG = {
  env: {},
  logger: {},
  backendMqttClient: null,
  backendMqttClientProxy: null,
  backendService: null,
  store: null,
  Afmachine: null,
};

/* ------------------------------ PRE CONFIGURE -------------------------- */

// get mode independent env
CONFIG.env.RUNTIME = detectRuntime();
CONFIG.env.MODE = detectMode();
CONFIG.env.BACKEND_URL = getEnvar(
  "BACKEND_URL",
  true,
  CONFIG.env.RUNTIME === "browser" && import.meta.env.BACKEND_URL
);
CONFIG.env.BACKEND_AUTH_USERNAME = getEnvar(
  "BACKEND_AUTH_USERNAME",
  true,
  CONFIG.env.RUNTIME === "browser" && import.meta.env.BACKEND_AUTH_USERNAME
);
CONFIG.env.BACKEND_AUTH_PASSWORD = getEnvar(
  "BACKEND_AUTH_PASSWORD",
  true,
  CONFIG.env.RUNTIME === "browser" && import.meta.env.BACKEND_AUTH_PASSWORD
);

// load dynamic libraries
var mqttLibrary;

if (CONFIG.env.RUNTIME === "node") {
  mqttLibrary = await import("mqtt");
} else {
  mqttLibrary = await import("precompiled-mqtt");
}

/* ------------------------------ CONFIGURE ------------------------------ */
switch (CONFIG.env.MODE) {
  case "dev":
    modeIndependent();
    dev();
    break;
  case "development":
    modeIndependent();
    dev();
    break;
  case "stag":
    modeIndependent();
    dev();
    break;
  case "staging":
    modeIndependent();
    dev();
    break;
  case "prod":
    modeIndependent();
    prod();
    break;
  case "production":
    modeIndependent();
    prod();
    break;
  default:
    throw new Error(`afmachine undefined mode:${CONFIG.env.MODE}`);
}

/* ------------------------------ POST CONFIGURE ------------------------------ */

// log configuration
console.log(CONFIG);

/* ------------------------------ MODE INDEPENDENT ------------------------------ */

function modeIndependent() {
  return;
}

/* ------------------------------ DEV MODE ------------------------------ */

function dev() {
  // configure environment
  CONFIG.env.LOGLEVEL = getEnvar("LOGLEVEL", false, "debug");

  // configure logger
  CONFIG.logger = new Pino({
    level: CONFIG.env.LOGLEVEL,
    name: "afmachine",
    timestamp: Pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
    },
    base: {
      mode: CONFIG.env.MODE,
      runtime: CONFIG.env.RUNTIME,
    },
    browser: { asObject: true },
  });

  // configure backendMqttClient
  CONFIG.backendMqttClient = new mqttLibrary.connect(CONFIG.env.URL, {
    username: CONFIG.env.BACKEND_AUTH_USERNAME,
    password: CONFIG.env.BACKEND_AUTH_PASSWORD,
  });

  // configure backendMqttClientProxy
  CONFIG.backendMqttClientProxy = new MqttProxy({
    id: "dev_001",
    server: CONFIG.backendMqttClient,
    registry: {
      params: { clientId: "dev_001" },
      routes: BACKEND_TOPICS,
      strict: true,
    },
  });

  // configure backendService
  CONFIG.backendService = backendService(
    CONFIG.backendMqttClientProxy,
    CONFIG.logger
  );

  // configure localStorage
  // TODO
  CONFIG.store = () => {};

  // configure Afmachine
  CONFIG.Afmachine = new AgentFactoryMachine({
    logger: CONFIG.logger,
    backend: CONFIG.backendService,
    store: CONFIG.store,
  });
}

/* ------------------------------ PROD MODE ------------------------------ */

function prod() {
  // configure environment
  CONFIG.env.LOGLEVEL = getEnvar("LOGLEVEL", false, "warn");

  // configure logger
  CONFIG.logger = new Pino({
    level: CONFIG.env.LOGLEVEL,
    name: "afmachine",
    timestamp: Pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
    },
    base: {
      mode: CONFIG.env.MODE,
      runtime: CONFIG.env.RUNTIME,
    },
    browser: CONFIG.env.RUNTIME === "browser" ? { asObject: true } : undefined,
  });
  // configure backendMqttClient
  // configure backendMqttClientProxy
  // configure localStorage
  // configure Afmachine
}

export { CONFIG };
