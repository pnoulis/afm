import { Player } from "../../entities/player/index.js";
import { Wristband } from "../../entities/wristband/index.js";
import { isObject } from "js_utils/misc";

function unregisterWristband(afmachine) {
  return [
    "/wristband/unregister",
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

    // unregister wristband
    async (context, next) => {
      context.res = await afmachine.services.backend.unregisterWristband(
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
          msg: `Failed to unpair ${context.player.username} from wristband ${context.player.wristband.id}`,
          reason: err.message,
        };
        throw err;
      }

      context.player.wristband = Wristband.normalize();
      context.res.payload = {
        ok: true,
        msg: `Successfuly unpaired ${context.player.username} from wristband ${context.req.wristbandNumber}`,
        data: context.player,
      };
      await next();
    },
  ];
}

function onUnregisterWristband(afmachine) {
  return [
    "/wristband/unregister",
    // argument parsing and validation
    async function (context, next) {
      // listener
      context.req = context.args.listener;
      if (typeof context.req !== "function") {
        throw new TypeError(
          `onWristbandRegistration listener function missing`,
        );
      }
      await next();
    },
    // subscribe wristband registration messages
    async (context, next) => {
      context.res = afmachine.services.backend.onUnregisterWristband(context.req);
      await next();
    },
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to subscribe to wristband unregistration topic",
          reason: err.message,
        };
        throw err;
      }
      context.res.payload = {
        ok: true,
        // unsubscribe function
        data: context.res,
      };
      await next();
    },
  ];
}

export { unregisterWristband, onUnregisterWristband };
