import { Pipeline } from "../../misc/pipeline/Pipeline.js";
import { globalLastMiddleware } from "../../middleware/globalLastMiddleware.js";

const pipelineBackend = new Pipeline();

pipelineBackend.setGlobalLast(globalLastMiddleware);

export { pipelineBackend };
