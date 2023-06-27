import * as Errors from "../../misc/errors.js";

async function parseResponse(context, next) {
  const { res } = context;
  if (res?.result === "NOK") {
    if (res?.validationErrors) {
      throw new Errors.ValidationError(res.validationErrors);
    } else {
      throw new Errors.ModelError(res);
    }
  }
  await next();
}

export { parseResponse };
