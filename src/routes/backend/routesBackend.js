import { pipelineBackend } from "./pipelineBackend.js";
import { parseResponse } from "../../middleware/backend/parseResponse.js";
import * as BACKEND_API from "../../services/backend/api/index.js";
import { Player } from "../../afmachine/player/index.js";

const boot = pipelineBackend.route(
  "/boot",
  async function (context, next) {
    context.res = await BACKEND_API.boot(context.req.payload);
    await next();
  },
  parseResponse
);

const registerPlayer = pipelineBackend.route(
  "/player/register",
  async function (context, next) {
    context.res = await BACKEND_API.registerPlayer(context.req.payload);
    await next();
  },
  parseResponse,

  // hydration middleware
  async function (context, next) {
    context.res.player = new Player({
      ...context.res.player,
      registered: true,
    });
    await next();
  }
);

const loginPlayer = pipelineBackend.route(
  "/player/login",
  async function (context, next) {
    context.res = await BACKEND_API.loginPlayer(context.req.payload);
    await next();
  },
  parseResponse,

  // hydration middleware
  async function (context, next) {
    context.res.yolo = "yolo";
    await next();
  }
);

const searchPlayer = pipelineBackend.route(
  "/player/search",
  async function (context, next) {
    context.res = await BACKEND_API.searchPlayer(context.req.payload);
    await next();
  },
  parseResponse
);

const listRegisteredPlayers = pipelineBackend.route(
  "/players/list",
  async function (context, next) {
    context.res = await BACKEND_API.listRegisteredPlayers(context.req.payload);
    await next();
  },
  parseResponse
);

const registerWristband = pipelineBackend.route(
  "/wristband/register",
  async function (context, next) {
    context.req.payload = {
      username: context.req.payload.player.username,
      wristbandNumber: context.req.payload.wristband.number,
    };
    await next();
  },
  async function (context, next) {
    context.res = await BACKEND_API.registerWristband(context.req.payload);
    await next();
  },
  parseResponse
);

const unregisterWristband = pipelineBackend.route(
  "/wristband/unregister",
  async function (context, next) {
    context.res = await BACKEND_API.unregisterWristband(context.req.payload);
    await next();
  },
  parseResponse
);

const infoWristband = pipelineBackend.route(
  "/wristband/info",
  async function (context, next) {
    context.res = await BACKEND_API.infoWristband(context.req.payload);
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
  mergeTeam,
  mergeGroupTeam,
  listTeams,
  startTeam,
  addPackage,
  removePackage,
  listPackages,
};
