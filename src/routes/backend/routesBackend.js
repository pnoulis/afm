import { pipelineBackend } from "./pipelineBackend.js";
import { parseResponse } from "../../middleware/backend/parseResponse.js";
import * as BACKEND_API from "../../services/backend/api/index.js";
import { Player } from "../../afmachine/player/index.js";

const boot = pipelineBackend.route(
  "/boot",
  async function (context, next) {
    context.res = await BACKEND_API.boot(context.req);
    await next();
  },
  parseResponse
);

/**
 * Register player route
 * @param {AfmachinePlayer || FrontEndPlayer} context.req
 **/
const registerPlayer = pipelineBackend.route(
  "/player/register",
  async function (context, next) {
    context.req.payload = {
      username: context.req.username,
      name: context.req.name,
      email: context.req.email,
      surname: context.req.surname,
      password: context.req.password,
    };
    await next();
  },
  async function (context, next) {
    context.res = await BACKEND_API.registerPlayer(context.req.payload);
    await next();
  },
  parseResponse,
  async function (context, next) {
    context.res.payload = context.res.player;
    await next();
  }
);

/**
 * Login player route
 * @param {AfmachinePlayer || FrontEndPlayer} context.req
 **/
const loginPlayer = pipelineBackend.route(
  "/player/login",
  async function (context, next) {
    context.req.payload = {
      username: context.req.username,
      password: context.req.password,
    };
    await next();
  },
  async function (context, next) {
    context.res = await BACKEND_API.loginPlayer(context.req.payload);
    await next();
  },
  parseResponse,
  async function (context, next) {
    context.res.payload = context.res.player;
    await next();
  }
);

/**
 * Search player route
 * @param {string} context.req - searchTerm
 **/
const searchPlayer = pipelineBackend.route(
  "/player/search",
  async function (context, next) {
    context.req = {
      payload: {
        searchTerm: context.req,
      },
    };
    await next();
  },
  async function (context, next) {
    context.res = await BACKEND_API.searchPlayer(context.req.payload);
    await next();
  },
  parseResponse
);

const listRegisteredPlayers = pipelineBackend.route(
  "/players/list",
  async function (context, next) {
    context.res = await BACKEND_API.listRegisteredPlayers();
    await next();
  },
  parseResponse
);

/**
 * Register wristband
 * @param {Object} context.req
 * @param {Object} context.req.player
 * @param {string} context.req.player.username
 * @param {Object} context.req.wristband
 * @param {number} [context.req.wristband.wristbandNumber]
 * @param {number} [context.req.wristband.number]
 */
const registerWristband = pipelineBackend.route(
  "/wristband/register",
  async function (context, next) {
    context.req.payload = {
      username: context.req.player.username,
      wristbandNumber:
        context.req.wristband.number || context.req.wristband.wristbandNumber,
    };
    await next();
  },
  async function (context, next) {
    context.res = await BACKEND_API.registerWristband(context.req.payload);
    await next();
  },
  parseResponse,
  async function (context, next) {
    context.res.payload = {
      number: context.req.payload.wristbandNumber,
      username: context.req.payload.username,
      msg: context.res.message,
    };
    await next();
  }
);

/**
 * Unregister wristband
 * @param {Object} context.req
 * @param {Object} context.req.player
 * @param {string} context.req.player.username
 * @param {Object} context.req.wristband
 * @param {number} [context.req.wristband.wristbandNumber]
 * @param {number} [context.req.wristband.number]
 */
const unregisterWristband = pipelineBackend.route(
  "/wristband/unregister",
  async function (context, next) {
    context.req.payload = {
      username: context.req.player.username,
      wristbandNumber:
        context.req.wristband.number || context.req.wristband.wristbandNumber,
    };
    await next();
  },
  async function (context, next) {
    context.res = await BACKEND_API.unregisterWristband(context.req.payload);
    await next();
  },
  parseResponse,
  async function (context, next) {
    context.res.payload = {
      number: context.req.payload.wristbandNumber,
      username: context.req.payload.username,
      msg: context.res.message,
    };
    await next();
  }
);

/**
 * Info wristband
 * @param {Object} req
 * @param {number} [req.number]
 * @param {number} [req.wristbandNumber]
 */
const infoWristband = pipelineBackend.route(
  "/wristband/info",
  async function (context, next) {
    context.req.payload = {
      wristbandNumber: context.req.number || context.req.wristbandNumber,
    };
    await next();
  },
  async function (context, next) {
    context.res = await BACKEND_API.infoWristband(context.req.payload);
    await next();
  },
  async function (context, next) {
    context.res.payload = {
      number: context.res.wristband.wristbandNumber,
      color: context.res.wristband.wristbandColor,
      active: context.res.wristband.active,
    };
    await next();
  },
  parseResponse
);

const subscribeWristbandScan = pipelineBackend.route(
  "/wristband/scan",
  async function (context, next) {
    context.res = await BACKEND_API.subscribeWristbandScan({
      listener: function (err, wristband) {
        if (err) {
          context.req.payload.listener(err, null);
        } else {
          context.req.payload.listener(err, {
            number: wristband.wristbandNumber,
            color: wristband.wristbandColor,
            active: wristband.active ?? false,
          });
        }
      },
    });
  },
  parseResponse
);

const getWristbandScan = pipelineBackend.route(
  "/wristband/scan",
  async function (context, next) {
    context.res = await BACKEND_API.getWristbandScan();
    await next();
  },
  async function (context, next) {
    context.res.payload = {
      number: context.res.wristbandNumber,
      color: context.res.wristbandColor,
      active: context.res.active ?? false,
    };
    await next();
  },
  parseResponse
);

const mergeTeam = pipelineBackend.route(
  "/team/merge",
  async function (context, next) {
    context.res = await BACKEND_API.mergeTeam(context.req.payload);
    await next();
  },
  parseResponse
);

const mergeGroupTeam = pipelineBackend.route(
  "/groupteam/merge",
  async function (context, next) {
    context.res = await BACKEND_API.mergeGroupTeam(context.req.payload);
    await next();
  },
  parseResponse
);

const listTeams = pipelineBackend.route(
  "/teams/all",
  async function (context, next) {
    context.res = await BACKEND_API.listTeams(context.req.payload);
    await next();
  },
  parseResponse
);

const startTeam = pipelineBackend.route(
  "/team/activate",
  async function (context, next) {
    context.res = await BACKEND_API.startTeam(context.req.payload);
    await next();
  },
  parseResponse
);

const addPackage = pipelineBackend.route(
  "/team/package/add",
  async function (context, next) {
    context.res = await BACKEND_API.addPackage(context.req.payload);
    await next();
  },
  parseResponse
);

const removePackage = pipelineBackend.route(
  "/team/package/delete",
  async function (context, next) {
    context.res = await BACKEND_API.removePackage(context.req.payload);
    await next();
  },
  parseResponse
);

const listPackages = pipelineBackend.route(
  "/packages/list",
  async function (context, next) {
    context.res = await BACKEND_API.listPackages(context.req.payload);
    await next();
  },
  parseResponse
);

export {
  boot,
  loginPlayer,
  registerPlayer,
  searchPlayer,
  listRegisteredPlayers,
  registerWristband,
  unregisterWristband,
  infoWristband,
  subscribeWristbandScan,
  getWristbandScan,
  mergeTeam,
  mergeGroupTeam,
  listTeams,
  startTeam,
  addPackage,
  removePackage,
  listPackages,
};
