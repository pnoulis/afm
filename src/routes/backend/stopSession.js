function stopSession(afmachine) {
  return [
    "/session/stop",
    // Argument parsing and validation
    async function (context, next) {
      context.admin = context.args?.user ?? context.args;
      context.report = context.args?.report ?? context.args.report;
      context.req = {
        jwt: context.admin.jwt,
        comment: context.report.comment,
      };
      await next();
    },
    // stop session
    async (context, next) => {
      context.res = await afmachine.services.backend.stopSession(context.req);
      await next();
    },
    // generic backend response parsing
    afmachine.middleware.parseResponse,
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to cashout!`,
          reason: err.message,
        };
        throw err;
      }
      context.res.payload = {
        ok: true,
        msg: `Successful cashout!`,
        data: context.admin,
      };
      await next();
    },
  ];
}

export { stopSession };
