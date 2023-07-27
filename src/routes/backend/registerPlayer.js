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
        msg: `Registered player ${context.player.username}`,
        data: context.player,
      };
      await next();
    },
  ];
}

export { registerPlayer };
