function startSession(afmachine) {
  return [
    "/session/start",
    // Argument parsing and validation
    async function (context, next) {
      context.admin = context.args?.user ?? context.args;
      context.req = {
        jwt: context.admin.jwt,
      };
      await next();
    },
    // start session;
    async (context, next) => {
      context.res = await afmachine.services.backend.startSession(context.req);
      await next();
    },
    // generic backend response parsing
    afmachine.middleware.parseResponse,
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `${context.admin.username} failed to start a session`,
          reason: err.message,
        };
        throw err;
      }
      context.res.payload = {
        ok: true,
        msg: `${context.admin.username} successfully started a session`,
        data: context.admin,
      };
      await next();
    },
  ];
}

export { startSession };
