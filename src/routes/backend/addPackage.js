function addPackage() {
  return [
    "/team/package/add",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.addPackage(context.req.payload);
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { addPackage };
