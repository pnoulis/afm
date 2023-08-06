function logoutCashier(afmachine) {
  return [
    "/cashier/logout",
    async (context, next) => {
      context.cashier = Object.hasOwn(context.args, "cashier")
        ? context.args.cashier
        : context.args;
      context.req = {
        timestamp: Date.now(),
        sessionId: context.cashier.sessionId,
        username: context.cashier.username,
      };

      await next();
    },
    // login cashier
    async (context, next) => {
      context.res = await (async () => {
        switch (context.req.username) {
          case "pavlos":
            return Promise.resolve({
              result: "OK",
              message: `Logged out user ${context.req.username}`,
            });
          case "sonic":
            return Promise.resolve({
              result: "OK",
              message: `Logged out user ${context.req.username}`,
            });
          default:
            return Promise.resolve({
              result: "NOK",
              message: `Cound not find login ${context.req.username}`,
            });
        }
      })();
      await next();
    },
    // generic backend response parsing
    afmachine.middleware.parseResponse,
    // specific backend response parser
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to logout cashier ${context.cashier.username}`,
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        msg: `Successfuly logged out cashier ${context.cashier.username}`,
        data: {},
      };
      await next();
    },
  ];
}

export { logoutCashier };
