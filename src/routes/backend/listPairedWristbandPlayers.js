function listPairedWristbandPlayers() {
  return [
    "/players/list/available",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.listPairedWristbandPlayers(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { listPairedWristbandPlayers };
