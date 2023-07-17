function verifyWristband() {
  return [
    "/wristband/info",
    // frontend - backend translation
    async function (context, next) {
      const wristband = context.req[0];
      context.req.payload = {
        wristbandNumber:
          typeof wristband === "number" ? wristband : wristband.number,
      };
      await next();
    },
    // backend service
    async (context, next) => {
      context.res = await this.services.backend.infoWristband(
        context.req.payload,
      );
      await next();
    },
    // generic backend response parser
    this.middleware.parseResponse,
    // backend - frontend translation
    async function (context, next) {
      context.res.payload = {
        number: context.res.wristband.wristbandNumber,
        color: context.res.wristband.wristbandColor,
        active: context.res.wristband.active,
      };
      await next();
    },
  ];
}

export { verifyWristband };
