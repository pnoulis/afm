function listTeams() {
  return [
    "/teams/all",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.listTeams(context.req.payload);
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { listTeams };
