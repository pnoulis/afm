function onScoreboardDevicesUpdate(afmachine) {
  return [
    "/scoreboard/devices/updates",
    // argument parsing and validation
    async function (context, next) {
      // listener
      context.req = context.args.listener;
      if (typeof context.req !== "function") {
        throw new TypeError(
          "onScoreboardDevicesUpdate listener function missing",
        );
      }
      await next();
    },
    // subscribe merge team message
    async (context, next) => {
      context.res = afmachine.services.backend.onScoreboardDevicesUpdate(
        context.req,
      );
      await next();
    },
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to subscribe to scoreboard devices update topic",
          reason: err.message,
        };
        throw err;
      }
      context.res.payload = {
        ok: true,
        // unsubscribe function
        data: context.res,
      };
      await next();
    },
  ];
}

export { onScoreboardDevicesUpdate };
