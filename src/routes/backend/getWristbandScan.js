import { Wristband } from "../../new_wristband/Wristband.js";

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
      const wristband = Wristband.translate(context.res);
      context.res.payload = {
        ok: true,
        msg: `Scanned ${wristband.color} wristband ${wristband.number}`,
        data: wristband,
      };
      await next();
    },
  ];
}

export { getWristbandScan };
