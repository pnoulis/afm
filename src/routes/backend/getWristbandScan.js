import { Wristband } from "../../entities/wristband/index.js";
import { mapWristbandColor } from "agent_factory.shared/utils/misc.js";

/**
 * @example
 * input: [ { unsubcb: () => {} }]
 * input from scan: { wristbandNumber, wristbandColor, active }
 * output: Wristband.translate(context.res);
 * @returns {Object} Wristband.translate()
 */

function getWristbandScan(afmachine) {
  return [
    "/wristband/scan",
    // argument parsing and validation
    async function (context, next) {
      context.req = context.args.unsubcb;
      await next();
    },
    // backend service
    async (context, next) => {
      context.res = await afmachine.services.backend.getWristbandScan(
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
          msg: "Failed to scan wristband",
          reason: err.message,
        };
        throw err;
      }

      context.wristband = Wristband.normalize(context.res);
      context.res.payload = {
        ok: true,
        msg: `Scanned ${mapWristbandColor(
          "colorCode",
          context.wristband.color,
        )} wristband ${context.wristband.id}`,
        data: context.wristband,
      };
      await next();
    },
  ];
}

export { getWristbandScan };
