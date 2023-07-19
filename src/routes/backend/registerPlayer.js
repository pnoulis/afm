import * as aferrs from "agent_factory.shared/errors.js";

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
function registerPlayer() {
  return [
    "/player/register",
    // frontend - backend translation
    async function (context, next) {
      const [request, options = {}] = context.args;
      context.req = {
        timestamp: Date.now(),
        username: request?.username || "",
        surname: request?.surname || "",
        name: request?.name || "",
        email: request?.email || "",
        password: request?.password || "",
      };
      await next();
    },
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.registerPlayer(context.req);
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
    // backend - frontend translation
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          msg: `Failed to register player ${context.req.username}`,
          reason: err.message,
          data: {},
        };
        throw err;
      }
      const { player = {} } = context.res;
      context.res.payload = {
        msg: `Registered player ${player?.username}`,
        data: {
          name: player?.name || "",
          surname: player?.surname || "",
          username: player?.username || "",
          email: player?.email || "",
        },
      };
      await next();
    },
  ];
}

export { registerPlayer };
