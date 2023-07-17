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
    // frontend - backend translation
    async function (context, next) {
      const [player, wristband] = context.req;
      context.req = {
        player,
        wristband,
        payload: {
          username: typeof player === "string" ? player : player.username,
          wristbandNumber:
            typeof wristband === "number" ? wristband : wristband.number,
        },
      };
      await next();
    },
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.registerWristband(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
    // backend - frontend translation
    async function (context, next) {
      context.res.payload = {
        player: context.req.player,
        wristband: context.req.wristband,
      };
      await next();
    },
  ];
}

export { registerWristband };
