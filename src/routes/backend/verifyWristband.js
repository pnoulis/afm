import * as aferrs from "agent_factory.shared/errors.js";
import { Wristband } from "../../new_wristband/Wristband.js";

function verifyWristband() {
  return [
    "/wristband/info",
    // argument parsing and validation
    async function (context, next) {
      const request = context.args;
      context.req = {
        timestamp: Date.now(),
        wristbandNumber: request.number,
      };
      await next();
    },
    // verify wristband
    async (context, next) => {
      context.res = await this.services.backend.infoWristband(context.req);
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to retrieve information on wristband ${context.req.wristbandNumber}`,
          reason: err.message,
        };
        throw err;
      }
      if (
        context.res.wristband.wristbandNumber !== context.req.wristbandNumber
      ) {
        throw new aferrs.ERR_MQTT_TANGLED_MSG(
          `Wristband verification request for rfid ${context.req.wristbandNumber} returned with rfid ${context.res.wristband.wristbandNumber}`,
        );
      }

      // merging of req and res because backend response does not
      // return with full data
      context.res.payload = {
        ok: true,
        data: Wristband.translate({
          ...context.res.wristband,
          ...context.args,
        }),
      };
      await next();
    },
  ];
}

export { verifyWristband };
