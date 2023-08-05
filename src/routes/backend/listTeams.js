import { Team } from "../../entities/team/index.js";
import { AF_PACKAGES } from "agent_factory.shared/constants.js";
import { extractTeams } from "../../utils/extractTeams.js";

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

      // const teams = extractTeams(context.res.teams);
      // for (let i = 0; i < teams.length; i++) {
      //   for (let y = 0; y < teams[i].packages.length; y++) {
      //     teams[i].packages[y].cost =
      //       AF_PACKAGES.find((pkg) => pkg.name === teams[i].packages[y].name)
      //         ?.cost ?? null;
      //   }
      // }

      context.res.payload = {
        ok: true,
        data: context.res.teams.map((t) => Team.normalize(t)),
      };
      await next();
    },
  ];
}

export { listTeams };
