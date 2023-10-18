import { Player } from "../../entities/player/index.js";

/**
 * Register player
 * @param {Object} player
 * @param {string} player.username
 * @param {string} player.surname
 * @param {string} player.name
 * @param {string} player.email
 * @param {string} [player.password]
 * @returns {Object} payload
 */
function registerPlayer(afmachine) {
  return [
    "/player/register",
    // Argument parsing and validation
    async function (context, next) {
      context.player = Player.normalize(
        Object.hasOwn(context.args, "player")
          ? context.args.player
          : context.args,
      );
      Object.assign(
        context.req,
        {
          timestamp: Date.now(),
        },
        context.player,
      );
      await next();
    },
    // register player
    async (context, next) => {
      context.res = await afmachine.services.backend.registerPlayer(
        context.req,
      );
      await next();
    },
    // generic backend response parsing
    afmachine.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to register player ${context.player.username}`,
          reason: err.message,
        };
        throw err;
      }

      context.player.state = "registered";
      context.res.payload = {
        ok: true,
        msg: `Successfully registered player: ${context.player.username}`,
        data: context.player,
      };
      await next();
    },
    afmachine.middleware.statisticRegisteredPlayers,
  ];
}

function onRegisterPlayer(afmachine) {
  return [
    "/player/register",
    // argument parsing and validation
    async function (context, next) {
      // listener
      context.req = context.args.listener;
      if (typeof context.req !== "function") {
        throw new TypeError("onRegisterPlayer listener function missing");
      }
      await next();
    },
    // subscribe register player message
    async (context, next) => {
      context.res = afmachine.services.backend.onRegisterPlayer(context.req);
      await next();
    },
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to subscribe to player register topic",
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

export { registerPlayer, onRegisterPlayer };
