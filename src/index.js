import { Pipeline } from "js_utils/pipeline";
import { CreateBackendService } from "agent_factory.shared/services/backend/CreateBackendService.js";
import { LoggerService } from "agent_factory.shared/services/logger/LoggerService.js";
import { LocalStorageService } from "agent_factory.shared/services/client_storage/local_storage/index.js";
import { parseResponse } from "./middleware/backend/parseResponse.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { isObject } from "js_utils/misc";
import { randomPlayer } from "agent_factory.shared/scripts/randomPlayer.js";
let Afmachine = {};
// import { Player } from './entities/player/index.js';

let clientId = "teuh";
const clientName = "afclient";

// storage service
// const storageService = new LocalStorageService(clientId);
// storageService.start();
// clientId = storageService.masterId;
// logger service
const loggerService = new LoggerService(clientId, clientName);
// backend service
const backendService = new CreateBackendService(clientId);

// Pipeline
const pipeline = new Pipeline();
pipeline.setGlobalLast(function (context, err) {
  // for DEBUG purposes
  // loggerService.debug(context);
  if (Object.hasOwn(context.res, "payload")) {
    context.res = context.res.payload;
  }
  if (err) {
    if (err instanceof aferrs.ERR_UNSUBSCRIBED) {
      throw err;
    } else {
      // loggerService.error(err);
      throw err;
    }
  }
});

const getWristbandScanHandle = (function () {
  let lock = false;
  return function () {
    if (lock) throw new aferrs.ERR_WRISTBAND_LOCK();
    lock = true;
    return function () {
      lock = !lock;
    };
  };
})();

Afmachine.boot = pipeline.route(
  "/boot",
  async function (context, next) {
    context.res = await backendService.boot();
    await next();
  },
  parseResponse,
);
Afmachine.list = pipeline.route("/list", async function (context, next) {
  context.res = await Promise.resolve(
    new Array(5).fill(null).map((_) => randomPlayer()),
  );
  await next();
});
Afmachine.lockWristbandScan = function () {
  return getWristbandScanHandle();
};
Afmachine.getWristbandScan = pipeline.route(
  "/wristband/scan",
  // backend service
  async function (context, next) {
    context.res = await backendService.getWristbandScan(context.req[0]);
    await next();
  },
  // generic backend response parser
  parseResponse,
  // backend - frontend translation
  async function (context, next) {
    context.res.payload = {
      number: context.res.wristbandNumber,
      color: context.res.wristbandColor,
      active: context.res.active ?? false,
    };
    await next();
  },
);

Afmachine.verifyWristband = pipeline.route(
  "/wristband/info",
  // frontend - backend translation
  async function (context, next) {
    const wristband = context.req[0];
    context.req.payload = {
      wristbandNumber:
        typeof wristband === "number" ? wristband : wristband.number,
    };
    await next();
  },
  // backend service
  async function (context, next) {
    context.res = await backendService.infoWristband(context.req.payload);
    await next();
  },
  // generic backend response parser
  parseResponse,
  // backend - frontend translation
  async function (context, next) {
    context.res.payload = {
      number: context.res.wristband.wristbandNumber,
      color: context.res.wristband.wristbandColor,
      active: context.res.wristband.active,
    };
    await next();
  },
);

/**
 * Register wristband
 * @param {(Object|string)} player
 * @param {string} player.username
 * @param {(Object|number)} wristband
 * @param {number} wristband.number
 */
Afmachine.registerWristband = pipeline.route(
  "/wristband/register",
  // frontend - backend translation
  async function (context, next) {
    const [player, wristband] = context.req;
    context.req = {
      player,
      wristband,
      payload: {
        username: typeof player === "string" ? player : player.username,
        wristbandNumber:
          typeof wristband === "number" ? wristband : wristband.number,
      },
    };
    await next();
  },
  // backend service
  async function (context, next) {
    context.res = await backendService.registerWristband(context.req.payload);
    await next();
  },
  // generic backend response parser
  parseResponse,
  // backend - frontend translation
  async function (context, next) {
    context.res.payload = {
      player: context.req.player,
      wristband: context.req.wristband,
    };
    await next();
  },
);

/**
 * Register player
 * @param {Object} player
 * @param {string} player.username
 * @param {string} player.surname
 * @param {string} player.name
 * @param {string} player.email
 * @param {string} [player.password]
 * @returns {Object} payload
 */
Afmachine.registerPlayer = pipeline.route(
  "/player/register",
  // frontend - backend translation
  async function (context, next) {
    const [player] = context.req;
    context.req = {
      player,
      payload: {
        username: player?.username || "",
        surname: player?.surname || "",
        name: player?.name || "",
        email: player?.email || "",
        password: player?.password || "",
      },
    };
    await next();
  },
  // backend service
  async function (context, next) {
    context.res = await backendService.registerPlayer(context.req.payload);
    await next();
  },
  // generic backend response parser
  parseResponse,
  // backend - frontend translation
  async function (context, next) {
    context.res.payload = {
      name: context.res.player.name || "",
      surname: context.res.player.surname || "",
      username: context.res.player.username || "",
      email: context.res.player.email || "",
    };
    await next();
  },
);

// const Player = await import("./entities/player/index.js");
export { Afmachine};
