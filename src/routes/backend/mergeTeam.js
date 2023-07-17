function mergeTeam() {
  return [
    "/team/merge",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.mergeTeam(context.req.payload);
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { mergeTeam };
