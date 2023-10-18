function registerCashier(afmachine) {
  return [
    "/admin/signup",
    // Argument parsing and validation
    async function (context, next) {
      context.req = {
        username: context.args.username,
        email: context.args.email,
        password: context.args.password,
        role: context.args.role,
      };
      await next();
    },
    // register cashier
    async function (context, next) {
      context.res = await afmachine.services.backend.signupAdmin(context.req);
      await next();
    },
    // generic backend response parsing
    afmachine.middleware.parseResponse,
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to register cashier: ${context.req.username}`,
          reason: err.message,
        };
        throw err;
      }
      context.res.payload = {
        ok: true,
        msg: `Successfully registered cashier: ${context.req.username}`,
        data: { ...context.res },
      };
      await next();
    },
  ];
}

export { registerCashier };
