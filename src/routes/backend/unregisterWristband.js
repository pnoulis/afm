import { isObject } from "js_utils/misc";

function unregisterWristband() {
  return [
    "/wristband/unregister",
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

    // unregister wristband
    async (context, next) => {
      context.res = await this.services.backend.unregisterWristband(
        context.req,
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to unpair ${context.req.username} from wristband ${context.req.wristbandNumber}`,
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        msg: `Successfuly unpaired ${context.req.username} from wristband ${context.req.wristbandNumber}`,
        data: { ...context.args },
      };
      await next();
    },
  ];
}

export { unregisterWristband };
