function listDevices(afmachine) {
  return [
    "/devices",
    // list devices
    async function (context, next) {
      context.res = await afmachine.services.backend.listDevices();
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // build response
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to list devices",
          reason: err.message,
        };
        throw err;
      }

      context.res.payload = {
        ok: true,
        data: context.res.devices,
      };
      await next();
    },
  ];
}

export { listDevices };
