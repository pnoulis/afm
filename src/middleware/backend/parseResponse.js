import * as aferrs from "agent_factory.shared/errors.js";

async function parseResponse(context, next) {
  const { res } = context;
  if (res?.result === "NOK") {
    if (res?.validationErrors) {
      throw new aferrs.ERR_BACKEND_VALIDATION(res.route, res.validationErrors);
    } else {
      throw new aferrs.ERR_BACKEND_MODEL(res.message);
    }
  }
  await next();
}

export { parseResponse };
