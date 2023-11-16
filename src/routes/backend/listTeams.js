import { Team } from "../../entities/team/index.js";

function listTeams(afmachine) {
  return [
    "/teams/all",
    // Argument parsing, validation and request builder
    async function (context, next) {
      context.req = {
        timestamp: Date.now(),
      };
      await next();
    },
    // list teams
    async (context, next) => {
      context.res = await afmachine.services.backend.listTeams(context.req);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // request parsing and response builder
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to list teams",
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        data: context.res.teams.map((t) => Team.normalize(t)),
      };
      await next();
    },
  ];
}

function onListTeams(afmachine) {
  return [
    "/teams/all",
    // argument parsing and validation
    async function (context, next) {
      // listener
      context.req = context.args.listener;
      if (typeof context.req !== "function") {
        throw new TypeError("onListTeams listener function missing");
      }
      await next();
    },
    async (context, next) => {
      context.res = afmachine.services.backend.onListTeams(context.req);
      await next();
    },
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to subscribe to all teams topic",
          reason: err.message,
        };
        throw err;
      }
      context.res.payload = {
        ok: true,
        // unsubscribe function
        data: context.res,
      };
      await next();
    },
  ];
}

export { listTeams, onListTeams };
