import { Wristband } from "../../entities/wristband/index.js";

/**
 * @example
 * input: [ { unsubcb: () => {} }]
 * input from scan: { wristbandNumber, wristbandColor, active }
 * output: Wristband.translate(context.res);
 * @returns {Object} Wristband.translate()
 */

function getWristbandScan() {
  return [
    "/wristband/scan",
    // argument parsing and validation
    async function (context, next) {
      const request = context.args;
      context.req = request.unsubcb;
      await next();
    },
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.getWristbandScan(context.req);
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
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
      context.res.payload = {
        ok: true,
        msg: `Scanned ${context.res.wristbandColor} wristband ${context.res.wristbandNumber}`,
        data: Wristband.translate(context.res),
      };
      await next();
    },
  ];
}

export { getWristbandScan };
