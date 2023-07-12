import { Pipeline } from "js_utils/pipeline";
import { CreateBackendService } from "agent_factory.shared/services/backend/CreateBackendService.js";
import { LoggerService } from "agent_factory.shared/services/logger/LoggerService.js";
import { LocalStorageService } from "agent_factory.shared/services/client_storage/local_storage/index.js";
import { parseResponse } from "./middleware/backend/parseResponse";

let clientId;
const clientName = "afclient";

// storage service
const storageService = new LocalStorageService(clientId);
storageService.start();
clientId = storageService.masterId;
// logger service
const loggerService = new LoggerService(clientId, clientName);
// backend service
const backendService = new CreateBackendService(clientId);

// Pipeline
const pipeline = new Pipeline();
pipeline.setGlobalLast(function (context, err) {
  // for DEBUG purposes
  loggerService.debug(context);
  // simpler context object for INFO purposes
  if (Object.hasOwn(context.res, "payload")) {
    context.res = context.res.payload;
  }
  if (Object.hasOwn(context.req, "payload")) {
    context.req = context.req.payload;
  }
  loggerService.info({
    route: context.route,
    req: context.req,
    res: context.res,
  });

  // case error
  if (err) {
    loggerService.error(err);
    throw err;
  }
});

const Afmachine = {
  boot: pipeline.route(
    "/boot",
    async function (context, next) {
      context.res = await backendService.boot();
      await next();
    },
    parseResponse,
  ),
};

export { Afmachine };
