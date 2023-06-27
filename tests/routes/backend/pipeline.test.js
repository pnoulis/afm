import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { Pipeline } from "../../../src/misc/pipeline/Pipeline.js";

/*
  DEPENDENCIES
 */
import { backendClientService } from "../../../src/services/backend/client.js";
import { globalLastMiddleware } from "../../../src/middleware/globalLastMiddleware.js";
import { parseResponse } from "../../../src/middleware/backend/parseResponse.js";
import * as Errors from "../../../src/misc/errors.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("pipelineBackend", () => {
  it("Should log the context at the end of the pipeline", async () => {
    const pipelineBackend = new Pipeline();
    const logContext = vi.fn(globalLastMiddleware);
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

  it("Should log an error if there is one and then throw it back", async () => {
    const pipelineBackend = new Pipeline();
    const handleError = vi.fn(globalLastMiddleware);
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

    await expect(route()).rejects.toThrowError("some error");
    expect(handleError).toHaveBeenCalledOnce();
    expect(handleError).toHaveBeenCalledWith(
      {
        route: "/some/route",
        req: { payload: {} },
        res: { name: "some response object" },
      },
      new Error("some error")
    );
  });
  it("Should parse the backend response", async () => {
    const pipelineBackend = new Pipeline();
    const spyParseResponse = vi.fn(parseResponse);
    const route = pipelineBackend.route(
      "/some/route",
      async (context, next) => {
        context.res = { result: "OK" };
        await next();
      },
      spyParseResponse
    );

    await expect(route()).resolves.toMatchObject({
      route: "/some/route",
      req: { payload: {} },
      res: { result: "OK" },
    });

    expect(spyParseResponse).toHaveBeenCalledOnce();
  });
  it("Should thrown a model error if the backend response with a NOK", async () => {
    const pipelineBackend = new Pipeline();
    const spyParseResponse = vi.fn(parseResponse);
    const route = pipelineBackend.route(
      "/some/route",
      async (context, next) => {
        context.res = { result: "NOK" };
        await next();
      },
      spyParseResponse
    );
    await expect(route()).rejects.toThrowError("ModelError");
    expect(spyParseResponse).toHaveBeenCalledOnce();
  });
  it("Should throw a validation error if the backend respond with a validation object", async () => {
    const pipelineBackend = new Pipeline();
    const spyParseResponse = vi.fn(parseResponse);
    const route = pipelineBackend.route(
      "/some/route",
      async (context, next) => {
        context.res = { result: "NOK", validationErrors: { name: "wrong" } };
        await next();
      },
      spyParseResponse
    );
    await expect(route()).rejects.toThrowError("ValidationError");
    expect(spyParseResponse).toHaveBeenCalledOnce();
  });
});
