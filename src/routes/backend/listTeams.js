function listTeams(afmachine) {
  return [
    "/teams/all",
    // backend service
    async (context, next) => {
      context.res = await afmachine.services.backend.listTeams(context.req.payload);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
  ];
}

export { listTeams };
