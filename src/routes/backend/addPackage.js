function addPackage(afmachine) {
  return [
    "/team/package/add",
    // backend service
    async (context, next) => {
      context.res = await afmachine.services.backend.addPackage(context.req.payload);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
  ];
}

export { addPackage };
