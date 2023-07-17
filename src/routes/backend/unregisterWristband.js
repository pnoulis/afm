function unregisterWristband() {
  return [
    "/wristband/unregister",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.unregisterWristband(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
  ];
}

export { unregisterWristband };
