function getWristbandScan() {
  return [
    "/wristband/scan",
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.getWristbandScan(
        context.req[0],
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
    // backend - frontend translation
    async function (context, next) {
      context.res.payload = {
        number: context.res.wristbandNumber,
        color: context.res.wristbandColor,
        active: context.res.active ?? false,
      };
      await next();
    },
  ];
}

export { getWristbandScan };
