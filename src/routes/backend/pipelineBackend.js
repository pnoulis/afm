import { Pipeline } from "../../misc/pipeline/Pipeline.js";
import { globalLastMiddleware } from "../../middleware/globalLastMiddleware.js";

const pipelineBackend = new Pipeline();

pipelineBackend.setGlobalLast(globalLastMiddleware);
pipelineBackend.setAfterEach(async (context, next) => {
  console.log(context.req.payload);
  await next();
});

export { pipelineBackend };
