function cashout(afmachine) {
  return [
    "/cashout",
    async function (context, next) {
      const session = context.session.get();
      context.user = session.user;
      context.userStats = session.stats;
      context.globalStats = context.session.global.get("stats");
      context.userReport = context.args;

      context.req = {
        timestamp: Date.now(),
        user: context.user,
        userReport: context.userReport,
        userStats: context.userStats,
        globalStats: context.globalStats,
      };
      console.log(context.req);
      await next();
    },
    // cashout
    async function (context, next) {
      context.res = await (async () => {
        // do whatanever;
        return Promise.resolve({
          result: "OK",
          message: "Cashout out",
        });
      })();
      await next();
    },
    // generic backend response parsing
    afmachine.middleware.parseResponse,
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to cashout cashier ${context.user.username}`,
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        msg: `Successfully cashed out cashier ${context.user.username}`,
        data: {},
      };
      await next();
    },
  ];
}

export { cashout };
