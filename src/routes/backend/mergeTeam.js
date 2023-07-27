function mergeTeam(afmachine) {
  return [
    "/team/merge",
    // backend service
    async (context, next) => {
      context.res = await afmachine.services.backend.mergeTeam(context.req.payload);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
  ];
}

export { mergeTeam };
