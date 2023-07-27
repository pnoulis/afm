function startTeam(afmachine) {
  return [
    "/team/activate",
    // backend service
    async (context, next) => {
      context.res = await afmachine.services.backend.startTeam(context.req.payload);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
  ];
}

export { startTeam };
