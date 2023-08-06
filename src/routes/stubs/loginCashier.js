import { smallid } from "js_utils/uuid";

function loginCashier(afmachine) {
  return [
    "/cashier/login",
    async (context, next) => {
      context.user = Object.hasOwn(context.args, "cashier")
        ? context.args.cashier
        : context.args;
      context.req = {
        timestamp: Date.now(),
        username: context.user.username,
        password: context.user.password,
      };

      await next();
    },
    // login cashier
    async (context, next) => {
      context.res = await (async () => {
        switch (context.req.username) {
          case "pavlos":
            if (context.req.password === "123") {
              return Promise.resolve({
                result: "OK",
                login: {
                  username: context.req.username,
                  sessionId: smallid(),
                  permissions: "cashier",
                  name: "pavlos",
                },
              });
            } else {
              return Promise.reject({
                result: "NOK",
                message: `wrong password`,
              });
            }
          case "sonic":
            if (context.req.password === "123") {
              return Promise.resolve({
                result: "OK",
                login: {
                  username: context.req.username,
                  sessionId: smallid(),
                  permissions: "cashier",
                  name: "vasilis",
                },
              });
            } else {
              return Promise.reject({
                result: "NOK",
                message: `wrong password`,
              });
            }
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
          msg: `Failed to login cashier ${context.user.username}`,
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        msg: `Successfuly logged in cashier ${context.user.username}`,
        data: context.res.login,
      };
      await next();
    },
    afmachine.middleware.statisticLogins,
  ];
}

export { loginCashier };
