import * as aferrs from "agent_factory.shared/errors.js";
import { Wristband } from "../../entities/wristband/index.js";

/**
 * @example
 * input: [ { number: 3 } ]
 * output: Wristband.translate({ ...context.res.wristband,  ...context.args })
 * @returns {Object} Wristband.translate()
 */

function verifyWristband(afmachine) {
  return [
    "/wristband/info",
    // argument parsing and validation
    async function (context, next) {
      context.wristband = Object.hasOwn(context.args, "wristband")
        ? context.args.wristband
        : context.args;

      context.wristband = Wristband.normalize(
        typeof context.wristband === "number"
          ? { id: context.wristband }
          : context.wristband,
      );


      context.req = {
        timestamp: Date.now(),
        wristbandNumber: context.wristband.id,
      };
      await next();
    },
    // verify wristband
    async (context, next) => {
      context.res = await afmachine.services.backend.infoWristband(context.req);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to retrieve information on wristband ${context.wristband.id}`,
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        data: Wristband.normalize(context.wristband, context.res.wristband),
      };
      await next();
    },
  ];
}

export { verifyWristband };
