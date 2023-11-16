function deleteCashier(afmachine) {
  return [
    "/admin/delete",
    // Argument parsing and validation
    async function (context, next) {
      context.req = {
        username: context.args.username,
        userId: context.args.id,
        timestamp: Date.now(),
      };
      await next();
    },
    // delete cashier
    async function (context, next) {
      context.res = await afmachine.services.backend.removeCashier(context.req);
      await next();
    },
    // generic backend response parsing
    afmachine.middleware.parseResponse,
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to delete cashier: ${context.req.username}`,
          reason: err.message,
        };
        throw err;
      }
      context.res.payload = {
        ok: true,
        msg: `Successfully deleted cashier: ${context.req.username}`,
        data: { ...context.res },
      };
      await next();
    },
  ];
}

export { deleteCashier };
