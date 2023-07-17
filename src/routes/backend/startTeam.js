function startTeam() {
  return [
    "/team/activate",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.startTeam(context.req.payload);
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { startTeam };
