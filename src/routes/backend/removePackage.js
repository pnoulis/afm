function removePackage() {
  return [
    "/team/package/delete",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.removePackage(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { removePackage };
