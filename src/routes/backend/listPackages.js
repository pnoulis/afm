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
  ];
}

export { listPackages };
