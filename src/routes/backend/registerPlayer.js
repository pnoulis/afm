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
      const [player] = context.req;
      context.req = {
        player,
        payload: {
          username: player?.username || "",
          surname: player?.surname || "",
          name: player?.name || "",
          email: player?.email || "",
          password: player?.password || "",
        },
      };
      await next();
    },
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.registerPlayer(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
    // backend - frontend translation
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          message: `Failed to register player ${context.req.payload.username}`,
          reason: err.message,
        };
      } else {
        context.res.message = `Registered player ${context.req.payload.username}`;
        context.res.payload = {
          name: context.res?.player?.name || "",
          surname: context.res?.player?.surname || "",
          username: context.res?.player?.username || "",
          email: context.res?.player?.email || "",
        };
      }
      await next(err);
    },
  ];
}

export { registerPlayer };
