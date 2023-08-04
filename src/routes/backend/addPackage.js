import { AF_PACKAGES } from "agent_factory.shared/constants.js";
import { Package } from "../../entities/package/index.js";
import { Team } from "../../entities/team/index.js";

function addPackage(afmachine) {
  return [
    "/team/package/add",
    // argument parsing and validation
    async function (context, next) {
      context.team = context.args.team;
      context.pkg = context.args.pkg;
      context.req = {
        timestamp: Date.now(),
        teamName: context.team.name,
        name: context.pkg.name,
      };
      await next();
    },
    // register package
    async (context, next) => {
      context.res = await afmachine.services.backend.addPackage(context.req);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to add ${context.pkg.name} package to ${context.team.name}`,
          reason: err.message,
        };
        throw err;
      }

      const data = [];
      for (let i = 0; i < context.res.team.packages.length; i++) {
        data.push(
          Package.normalize(context.res.team.packages[i], {
            pkgs: AF_PACKAGES,
          }),
        );
      }
      context.res.payload = {
        ok: true,
        msg: `Successfuly added ${context.pkg.name} package to ${context.team.name}`,
        data,
      };
      await next();
    },
  ];
}

export { addPackage };
