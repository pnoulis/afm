function setScoreboardViews(afmachine) {
  return [
    "/scoreboard/devices/views/set",
    // Argument parsing and validation
    async function (context, next) {
      context.req = {
        deviceId: context.args.deviceId,
      };
      await next();
    },
    // list scoreboard teams
    async (context, next) => {
      context.res = await afmachine.services.backend.setScoreboardViews(
        context.req,
      );
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // build response
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `failed to set scoreboard device ${context.req.deviceId} view`,
          reason: err.message,
        };
        throw err;
      }
      context.res.payload = {
        ok: true,
        data: context.res,
      };

      await next();
    },
  ];
}

export { setScoreboardViews };
