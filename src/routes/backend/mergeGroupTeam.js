import { Team } from "../../entities/team/index.js";
import { Roster } from "../../entities/roster/index.js";

function mergeGroupTeam(afmachine) {
  return [
    "/groupteam/merge",
    // Argument parsing and validation
    async function (context, next) {
      context.team = context.args;
      context.req = {
        timestamp: Date.now(),
        teamName: context.team.name,
        groupPlayers: context.team.roster.asObject().map((player) => ({
          username: player.username,
          wristbandNumber: player.wristband.id,
        })),
      };
      await next();
    },
    // Merge group team
    async (context, next) => {
      context.res = await afmachine.services.backend.mergeGroupTeam(
        context.req,
      );
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to merge group team ${context.team.name}`,
          reason: err.message,
        };
        throw err;
      }

      const data = Team.normalize(context.team, { state: "merged" });
      context.res.payload = {
        ok: true,
        msg: `Merged group team ${context.team.name}`,
        data: data,
      };
      await next();
    },
  ];
}

export { mergeGroupTeam };
