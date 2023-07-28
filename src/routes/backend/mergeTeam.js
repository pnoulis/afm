import { Team } from "../../entities/team/index.js";

function mergeTeam(afmachine) {
  return [
    "/team/merge",
    // Argument parsing and validation
    async function (context, next) {
      context.team = context.args;
      context.req = {
        timestamp: Date.now(),
        teamName: context.team.name,
        usernames: context.team.roster.get().map((p) => p.username),
      };
      await next();
    },

    // Merge team
    async (context, next) => {
      console.log(context);
      context.res = await afmachine.services.backend.mergeTeam(context.req);
      console.log(context);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to merge team ${context.team.name}`,
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        msg: `Merged team ${context.team.name}`,
        data: context.res.message,
      };
      await next();
    },
  ];
}

export { mergeTeam };
