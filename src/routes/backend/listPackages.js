function listPackages() {
  return [
    "/packages/list",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.listPackages(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to list packages",
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        data: context.res.packages,
      };
      await next();
    },
  ];
}

export { listPackages };
