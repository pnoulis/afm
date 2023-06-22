import { pipelineBackend } from "./pipelineBackend.js";
import * as BACKEND_API from "../../services/backend/api/index.js";

const boot = pipelineBackend.route("/boot", async function (context, next) {
  context.res = await BACKEND_API.boot(context.req.payload);
  await next();
});

export { boot };
