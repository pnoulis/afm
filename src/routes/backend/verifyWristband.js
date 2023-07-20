import * as aferrs from "agent_factory.shared/errors.js";
import { Wristband } from "../../entities/wristband/index.js";

/**
 * @example
 * input: [ { number: 3 } ]
 * output: Wristband.translate({ ...context.res.wristband,  ...context.args })
 * @returns {Object} Wristband.translate()
 */

function verifyWristband() {
  return [
    "/wristband/info",
    // argument parsing and validation
    async function (context, next) {
      const wristband = context.args;
      context.req = {
        timestamp: Date.now(),
        wristbandNumber: wristband.number,
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
        err = new aferrs.ERR_MQTT_TANGLED_MSG(
          `Wristband verification request for rfid ${context.req.wristbandNumber} returned with rfid ${context.res.wristband.wristbandNumber}`,
        );

        context.res.payload = {
          ok: false,
          msg: `Failed to retrieve information on wristband ${context.req.wristbandNumber}`,
          reason: err.message,
        };
        throw err;
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
