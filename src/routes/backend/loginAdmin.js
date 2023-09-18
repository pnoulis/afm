function loginAdmin(afmachine) {
  return [
    "/admin/login",
    // Argument parsing and validation
    async function (context, next) {
      const admin = context.args?.admin ?? context.args;
      context.req = {
        username: admin.username ?? "",
        password: admin.password ?? "",
      };
      await next();
    },
    // login admin
    async (context, next) => {
      context.res = await afmachine.services.backend.loginAdmin(context.req);
      await next();
    },
    // generic backend response parsing
    afmachine.middleware.parseResponse,
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to login administrator ${context.req.username}`,
          reason: err.message,
        };
        throw err;
      }
      context.res.payload = {
        ok: true,
        msg: `Successfuly logged in cashier ${context.req.username}`,
        data: context.res.jwtResponse,
      };
      await next();
    },
  ];
}

export { loginAdmin };
