function unregisterWristband() {
  return [
    "/wristband/unregister",
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
      context.res = await this.services.backend.unregisterWristband(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { unregisterWristband };
