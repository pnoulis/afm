import { Pipeline } from "../../misc/pipeline/Pipeline.js";

const pipelineBackend = new Pipeline();

pipelineBackend.setGlobalLast(function (context, err) {
  console.log(context);
});

export { pipelineBackend };
