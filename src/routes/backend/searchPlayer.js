function searchPlayer() {
  return [
    "/player/search",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.searchPlayer(context.req.payload);
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ]
}

export { searchPlayer };
