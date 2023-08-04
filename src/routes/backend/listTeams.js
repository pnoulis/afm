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
        data: context.res.teams.map((t) => new Team(Team.normalize(t))),
      };
      await next();
    },
  ];
}

export { listTeams };
