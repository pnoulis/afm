function removePackage(afmachine) {
  return [
    "/team/package/delete",
    // backend service
    async (context, next) => {
      context.res = await afmachine.services.backend.removePackage(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
  ];
}

export { removePackage };
