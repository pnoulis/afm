function mergeGroupTeam() {
  return [
    "/groupteam/merge",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.mergeGroupTeam(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { mergeGroupTeam };
