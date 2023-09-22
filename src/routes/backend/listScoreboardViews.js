function listScoreboardViews(afmachine) {
  return [
    "/scoreboard/devices/views/get",
    // list scoreboard views
    async (context, next) => {
      context.res = await afmachine.services.backend.listScoreboardViews(
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
          msg: "Failed to list available scoreboard views",
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        data: context.res.scoreboardStatuses,
      };

      await next();
    },
  ];
}

export { listScoreboardViews };
