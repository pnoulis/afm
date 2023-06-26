import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { Pipeline } from "../../../src/misc/pipeline/Pipeline.js";

/*
  DEPENDENCIES
 */
import { backendClientService } from "../../../src/services/backend/client.js";
import * as Errors from "../../../src/misc/errors.js";
import {
  registerPlayer,
  registerWristband,
} from "../../../src/services/backend/api/index.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("pipelineBackend", () => {
  it("Should log the context at the end of the pipeline", async () => {
    const pipelineBackend = new Pipeline();
    const logContext = vi.fn((context, err) => {
      console.log(context);
    });
    pipelineBackend.setGlobalLast(logContext);
    const route = pipelineBackend.route(
      "/some/route",
      async (context, next) => {
        context.res = {
          name: "some response object",
        };
        await next();
      }
    );
    await route();
    expect(logContext).toHaveBeenCalledOnce();
    expect(logContext).toHaveBeenCalledWith(
      {
        route: "/some/route",
        req: { payload: {} },
        res: { name: "some response object" },
      },
      undefined
    );
  });

  it.only("Should handle any errors", async () => {
    const pipelineBackend = new Pipeline();
    const handleError = vi.fn((context, err) => {
      console.log("WITHIN HANDLE ERROR");
      console.log(context);
      if (err) {
        console.log(context);
        throw err;
      }
      return context;
    });
    pipelineBackend.setGlobalLast(handleError);
    const route = pipelineBackend.route(
      "/some/route",
      async (context, next) => {
        context.res = {
          name: "some response object",
        };
        throw new Error("some error");
      }
    );

    let response;
    try {
      response = await route();
    } catch (err) {
      response = err;
    }
    // .then((res) => {
    //   console.log("res arrived");
    // })
    // .catch((err) => {
    //   console.log("err arrived");
    // });
  });
});
