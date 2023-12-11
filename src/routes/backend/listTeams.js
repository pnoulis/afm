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

      console.log("PACKAGE COMPLETE TEST");
      // context.res.teams[2].packages[0].ended = Date.now() - 500000;
      console.log(context.res.teams);
      // const yolo = context.res.teams.find((t) => t.name === "yolo yolo");
      // yolo.packages[0].ended = Date.now() - 50000;
      console.dir(context.res.teams[0], {
        depth: null,
      });
      const data = context.res.teams.map((t) => Team.normalize(t));
      context.res.payload = {
        ok: true,
        data,
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
