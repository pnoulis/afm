import { Package } from "../../entities/package/index.js";

function listPackages(afmachine) {
  return [
    "/packages/list",
    // Argument parsing, validation and request builder
    async function (context, next) {
      context.req = {
        timestamp: Date.now(),
      };
      await next();
    },
    // list packages
    async (context, next) => {
      context.res = await afmachine.services.backend.listPackages(context.req);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // request parsing and response builder
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to list packages",
          reason: err.message,
        };
        throw err;
      }
      const data = context.res.packages.map((p) => Package.normalize(p));
      context.res.payload = {
        ok: true,
        data,
      };
      await next();
    },
  ];
}

export { listPackages };
