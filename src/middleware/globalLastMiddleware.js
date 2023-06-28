import { LOGGER } from "../config.js";

function globalLastMiddleware(context, err) {
  // for DEBUG purposes
  LOGGER.debug(context);

  // simpler context object for INFO purposes
  if (Object.hasOwn(context.res, "payload")) {
    context.res = context.res.payload;
  }

  if (Object.hasOwn(context.req, "payload")) {
    context.req = context.req.payload;
  }

  LOGGER.info({
    route: context.route,
    req: context.req,
    res: context.res.result,
  });

  // case error
  if (err) {
    LOGGER.error(err);
    throw err;
  }
}

export { globalLastMiddleware };
