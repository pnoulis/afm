import { isObject } from "js_utils/misc";
/**
 * Register wristband
 * @param {(Object|string)} player
 * @param {string} player.username
 * @param {(Object|number)} wristband
 * @param {number} wristband.number
 */
function registerWristband() {
  return [
    "/wristband/register",
    // argument parsing and validation
    async function (context, next) {
      const { wristband, player } = context.args;
      context.req = {
        timestamp: Date.now(),
        username: isObject(player) ? player.username : player,
        wristbandNumber: isObject(wristband) ? wristband.number : wristband,
      };
      await next();
    },
    // register wristband
    async (context, next) => {
      context.res = await this.services.backend.registerWristband(context.req);
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to pair ${context.req.username} to wristband ${context.req.wristbandNumber}`,
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        msg: `Successfuly paired ${context.req.username} to wristband ${context.req.wristbandNumber}`,
        data: { ...context.args },
      };
      await next();
    },
  ];
}

export { registerWristband };
