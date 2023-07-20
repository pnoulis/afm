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
    // Argument parsing and validation
    async function (context, next) {
      const request = context.args;
      context.req = {
        timestamp: Date.now(),
        username: request.username || "",
        surname: request.surname || "",
        name: request.name || "",
        email: request.email || "",
        password: request.password || "",
      };
      await next();
    },
    // register player
    async (context, next) => {
      context.res = await this.services.backend.registerPlayer(context.req);
      await next();
    },
    // generic backend response parsing
    this.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to register player ${context.req.username}`,
          reason: err.message,
        };
        throw err;
      }
      const { player = {} } = context.res;
      context.res.payload = {
        ok: true,
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
