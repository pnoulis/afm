function mergeGroupTeam(afmachine) {
  return [
    "/groupteam/merge",
    // backend service
    async (context, next) => {
      context.res = await afmachine.services.backend.mergeGroupTeam(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
  ];
}

export { mergeGroupTeam };
