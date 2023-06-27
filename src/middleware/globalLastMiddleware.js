import { LOGGER } from "../config.js";

function globalLastMiddleware(context, err) {
  if (err) {
    LOGGER.error(err, context);
    throw err;
  }
  LOGGER.info({
    route: context.route,
    req: context.req.payload,
    res: context.res.result,
  });
  LOGGER.debug(context);
  return context;
}

export { globalLastMiddleware };
