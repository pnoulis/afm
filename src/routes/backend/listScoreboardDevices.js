function listScoreboardDevices(afmachine) {
  return [
    "/scoreboard/devices",
    // list scoreboard devices
    async (context, next) => {
      context.res = await afmachine.services.backend.listScoreboardDevices(
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
          msg: "Failed to list scoreboard devices",
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        data: context.res.scoreboardDevices,
      };

      await next();
    },
  ];
}

export { listScoreboardDevices };
