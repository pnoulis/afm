function boot() {
  return [
    "/boot",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.boot();
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { boot };
