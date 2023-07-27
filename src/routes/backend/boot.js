function boot(afmachine) {
  return [
    "/boot",
    // backend service
    async (context, next) => {
      context.res = await afmachine.services.backend.boot();
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
  ];
}

export { boot };
