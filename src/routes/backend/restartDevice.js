function restartDevice(afmachine) {
  return [
    "/devices/action",
    // Argument parsing and validation
    async function (context, next) {
      context.req = {
        deviceId: context.args.deviceId,
      };
      await next();
    },
    // restart device
    async function (context, next) {
      context.res = await afmachine.services.backend.restartDevice(context.req);
      await next();
    },
    // generic backend response parsing
    afmachine.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to restart device: ${context.req.deviceId || "ALL"}`,
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        msg: `Successfuly restarted device: ${context.req.deviceId || "ALL"}`,
      };
      await next();
    },
  ];
}

export { restartDevice };
