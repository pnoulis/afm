import * as aferrs from "agent_factory.shared/errors.js";
import { Pipeline } from "js_utils/pipeline";

const pipeline = new Pipeline();

pipeline.setAfterAll(async function (context, next, err) {
  if (err) {
    if (/timeout/.test(err.message)) {
      err = new aferrs.ERR_TIMEOUT();
    }
    err.context = context;
    throw err;
  }
  await next();
});

pipeline.setGlobalLast(function (context, next, err) {

})
