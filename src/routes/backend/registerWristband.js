import { Player } from "../../entities/player/index.js";
import { Wristband } from "../../entities/wristband/index.js";
import { isObject } from "js_utils/misc";

/**
 * @example
 * input: [ { wristband, player } ]
 * Register wristband
 * @param {(Object|string)} player
 * @param {string} player.username
 * @param {(Object|number)} wristband
 * @param {number} wristband.number
 * @returns {Object} input
 */
function registerWristband() {
  return [
    "/wristband/register",
    // argument parsing and validation
    async function (context, next) {
      context.player = Object.hasOwn(context.args, "player")
        ? context.args.player
        : context.args;
      context.wristband = Object.hasOwn(context.args, "wristband")
        ? context.args.wristband
        : context.player.wristband;

      context.player = Player.normalize(
        typeof context.player === "string"
          ? { username: context.player }
          : context.player,
      );
      context.player.wristband = Wristband.normalize(
        context.player.wristband,
        typeof context.wristband === "number"
          ? { id: context.wristband }
          : context.wristband,
      );
      context.req = {
        timestamp: Date.now(),
        username: context.player.username,
        wristbandNumber: context.player.wristband.id,
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
          msg: `Failed to pair ${context.player.username} to wristband ${context.player.wristband.id}`,
          reason: err.message,
        };
        throw err;
      }

      context.player.wristband.state = "registered";
      context.res.payload = {
        ok: true,
        msg: `Successfuly paired ${context.player.username} to wristband ${context.player.wristband.id}`,
        data: context.player,
      };
      await next();
    },
  ];
}

export { registerWristband };
