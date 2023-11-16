function listCashiers(afmachine) {
  return [
    "/admin/list",
    // list cashiers
    async function (context, next) {
      context.res = await afmachine.services.backend.listCashiers();
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // build response
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to list cashiers",
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        data: context.res.cashiers,
      };
      await next();
    },
  ];
}

export { listCashiers };
