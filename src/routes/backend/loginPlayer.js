function loginPlayer() {
  return [
    "/player/login",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.login(context.req.payload);
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { loginPlayer };
