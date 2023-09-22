function listScoreboardTeams(afmachine) {
  return [
    "/scoreboard/teams",
    // list scoreboard teams
    async (context, next) => {
      context.res = await afmachine.services.backend.listScoreboardTeams();
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // // build response
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to list teams scores",
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

export { listScoreboardTeams };
