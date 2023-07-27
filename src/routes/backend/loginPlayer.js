function loginPlayer(afmachine) {
  return [
    "/player/login",
    // backend service
    async (context, next) => {
      context.res = await afmachine.services.backend.login(context.req.payload);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
  ];
}

export { loginPlayer };
