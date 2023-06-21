import { describe, it, expect, vi, beforeAll } from "vitest";
import {
  registerGlobalErrorHandler,
  beforeEachMiddleware,
  afterAllMiddleware,
  afterEachMiddleware,
  beforeAllMiddleware,
  Route,
  Router,
} from "../src/routes/Router.js";
import { listRegisteredPlayers } from "../src/backend/actions/index.js";
import backendClientService from "../src/backend/backend.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("router", () => {
  it("Should return a function", () => {
    const route = new Router(() => {});
    expect(route).toBeTypeOf("function");
  });
  it("Should execute a sequence of functions in the registered order", async () => {
    const introduceRoute = vi.fn(async (context, next) => {
      console.log("before all middleware");
      context.introduced = true;
      console.log(context);
      await next();
    });

    const concludeRoute = vi.fn(async (context, next) => {
      console.log("after all middleware");
      context.concluded = true;
      console.log(context);
      await next();
    });

    const beforeCalling = vi.fn(async (context, next) => {
      console.log("before each middleware");
      await next();
    });

    const afterCalling = vi.fn(async (context, next) => {
      console.log("after each middleware");
      await next();
    });

    const routeHandler = vi.fn(async (context, next) => {
      console.log("the route handler");
      context.handled = true;
      console.log(context);
      await next();
    });

    const routeHandler2 = vi.fn(async (context, next) => {
      console.log("the second route handler");
      await next();
    });

    beforeAllMiddleware(introduceRoute);
    afterAllMiddleware(concludeRoute);
    afterEachMiddleware(afterCalling);
    beforeEachMiddleware(beforeCalling);
    const route = new Router(routeHandler, routeHandler2);
    await route({ name: "pavlos" });
    expect(introduceRoute).toHaveBeenCalledOnce();
    expect(routeHandler).toHaveBeenCalledOnce();
    expect(routeHandler2).toHaveBeenCalledOnce();
    expect(concludeRoute).toHaveBeenCalledOnce();
    expect(afterCalling).toHaveBeenCalledTimes(2);
    expect(beforeCalling).toHaveBeenCalledTimes(2);
  });
  it("Should handle asyncronous code", async () => {
    const introduceRoute = vi.fn(async (context, next) => {
      console.log("before all middleware");
      context.introduced = true;
      console.log(context);
      await next();
    });

    const concludeRoute = vi.fn(async (context, next) => {
      console.log("after all middleware");
      context.concluded = true;
      console.log(context);
      await next();
    });

    const beforeCalling = vi.fn(async (context, next) => {
      console.log("before each middleware");
      await next();
    });

    const afterCalling = vi.fn(async (context, next) => {
      console.log("after each middleware");
      await next();
    });

    beforeAllMiddleware(introduceRoute);
    afterAllMiddleware(concludeRoute);
    afterEachMiddleware(afterCalling);
    beforeEachMiddleware(beforeCalling);
    const route = new Router(async function (context, next) {
      console.log("listing registered players");
      let players;
      try {
        players = await listRegisteredPlayers();
        console.log("after listing registered players");
        console.log(players);
        context.players = players;
        next();
      } catch (err) {
        console.log(err);
      }
      console.log("leaving listing");
    });

    await route({ name: "yolo" });
    expect(introduceRoute).toHaveBeenCalledTimes(1);
    expect(concludeRoute).toHaveBeenCalledTimes(1);
    expect(afterCalling).toHaveBeenCalledTimes(1);
    expect(beforeCalling).toHaveBeenCalledTimes(1);
  });
  it("Should gracefully handle errors", async () => {
    const introduceRoute = vi.fn(async (context, next) => {
      await next();
    });
    const concludeRoute = vi.fn(async (context, next) => {
      await next();
    });
    const beforeCalling = vi.fn(async (context, next) => {
      await next();
    });
    const afterCalling = vi.fn(async (context, next) => {
      await next();
    });

    beforeAllMiddleware(introduceRoute);
    afterAllMiddleware(concludeRoute);
    afterEachMiddleware(afterCalling);
    beforeEachMiddleware(beforeCalling);
    const route = new Router(
      async function (context, next) {
        await listRegisteredPlayers();
        throw new Error("some error");
      },
      async (context, next) => {
        await next();
      }
    );

    let response;
    try {
      response = await route({ name: "yolo" });
    } catch (err) {
      response = err;
    }
    expect(response).toBe(undefined);
    expect(introduceRoute).toHaveBeenCalledTimes(1);
    expect(concludeRoute).toHaveBeenCalledTimes(0);
    expect(afterCalling).toHaveBeenCalledTimes(0);
    expect(beforeCalling).toHaveBeenCalledTimes(1);
  });

  it("Should allow registering a global error handler", async () => {
    const introduceRoute = vi.fn(async (context, next) => {
      await next();
    });
    const concludeRoute = vi.fn(async (context, next) => {
      await next();
    });
    const beforeCalling = vi.fn(async (context, next) => {
      await next();
    });
    // err handler
    const afterCalling = vi.fn(async (context, next) => {
      await next();
    });

    const globalErrHandler = vi.fn((context, err) => {
      // do nothing;
      return;
    });

    registerGlobalErrorHandler(globalErrHandler);
    beforeAllMiddleware(introduceRoute);
    afterAllMiddleware(concludeRoute);
    afterEachMiddleware(afterCalling);
    beforeEachMiddleware(beforeCalling);
    const route = new Router(
      async function (context, next) {
        await listRegisteredPlayers();
        throw new Error("some error");
      },
      async (context, next) => {
        await next();
      }
    );

    await route({ name: "yolo" });
    expect(introduceRoute).toHaveBeenCalledTimes(1);
    expect(concludeRoute).toHaveBeenCalledTimes(0);
    expect(afterCalling).toHaveBeenCalledTimes(0);
    expect(beforeCalling).toHaveBeenCalledTimes(1);
    expect(globalErrHandler).toHaveBeenCalledOnce();
  });
  it("Should allow error chaining", async () => {
    const introduceRoute = vi.fn(async (context, next) => {
      await next();
    });
    const concludeRoute = vi.fn(async (context, next) => {
      await next();
    });
    const beforeCalling = vi.fn(async (context, next) => {
      await next();
    });
    const afterCalling = vi.fn(async (context, next) => {
      await next();
    });

    const customErrHandler = vi.fn(async (context, next, err) => {
      console.log("CUSTOM ERR HANDLER #1");
      // pass error to the next handler in the chain
      await next(err);
    });

    const customErrHandler2 = vi.fn(async (context, next, err) => {
      console.log("CUSTOM ERR HANDLER #2");
      // pass error to the next handler in the chain
      await next(err);
    });

    const globalErrHandler = vi.fn(async (context, err) => {
      // do nothing
      return;
    });

    registerGlobalErrorHandler(globalErrHandler);
    beforeAllMiddleware(introduceRoute);
    afterAllMiddleware(concludeRoute);
    afterEachMiddleware(afterCalling);
    beforeEachMiddleware(beforeCalling);
    const route = new Router(
      async function (context, next) {
        await listRegisteredPlayers();
        throw new Error("some error");
      },
      customErrHandler,
      customErrHandler2
    );

    await route({ name: "yolo" });
    expect(introduceRoute).toHaveBeenCalledTimes(1);
    expect(concludeRoute).toHaveBeenCalledTimes(0);
    expect(afterCalling).toHaveBeenCalledTimes(0);
    expect(beforeCalling).toHaveBeenCalledTimes(1);
    expect(customErrHandler).toHaveBeenCalledOnce();
    expect(customErrHandler2).toHaveBeenCalledOnce();
    expect(globalErrHandler).toHaveBeenCalledOnce();
  });
  it("Should expect errors within error handlers", async () => {
    const introduceRoute = vi.fn(async (context, next) => {
      await next();
    });
    const concludeRoute = vi.fn(async (context, next) => {
      await next();
    });
    const beforeCalling = vi.fn(async (context, next) => {
      await next();
    });
    const afterCalling = vi.fn(async (context, next) => {
      await next();
    });

    const customErrHandler = vi.fn(async (context, next, err) => {
      console.log("CUSTOM ERR HANDLER #1");
      // throw error within the custom error handler
      throw new Error("error handler error");
    });

    const globalErrHandler = vi.fn(async (context, err) => {
      // return the err
      return err;
    });

    registerGlobalErrorHandler(globalErrHandler);
    beforeAllMiddleware(introduceRoute);
    afterAllMiddleware(concludeRoute);
    afterEachMiddleware(afterCalling);
    beforeEachMiddleware(beforeCalling);
    const route = new Router(async function (context, next) {
      await listRegisteredPlayers();
      throw new Error("some error");
    }, customErrHandler);

    await route({ name: "yolo" });
    expect(introduceRoute).toHaveBeenCalledTimes(1);
    expect(concludeRoute).toHaveBeenCalledTimes(0);
    expect(afterCalling).toHaveBeenCalledTimes(0);
    expect(beforeCalling).toHaveBeenCalledTimes(1);
    expect(customErrHandler).toHaveBeenCalledOnce();
    expect(globalErrHandler.mock.results[0].value.message).toMatch(
      "error handler error"
    );
  });
  it.only("Should handle large pipelines", async () => {
    const beforeAll = new Array(30).fill(
      vi.fn(async (context, next) => {
        await next();
      })
    );
    const afterAll = new Array(30).fill(
      vi.fn(async (context, next) => {
        await next();
      })
    );
    const beforeEach = new Array(30).fill(
      vi.fn(async (context, next) => {
        await next();
      })
    );
    const afterEach = new Array(30).fill(
      vi.fn(async (context, next) => {
        await next();
      })
    );

    const route = new Router(
      async function (context, next) {
        const response = await listRegisteredPlayers();
        context.res = { ...context, ...response };
        await next();
      },
      async function (context, next) {
        await next();
      }
    );

    beforeAllMiddleware(...beforeAll);
    afterAllMiddleware(...afterAll);
    afterEachMiddleware(...afterEach);
    beforeEachMiddleware(...beforeEach);
    const response = await route({});
    expect(beforeAll[0]).toHaveBeenCalledTimes(30);
    expect(afterAll[0]).toHaveBeenCalledTimes(30);
    expect(beforeEach[0]).toHaveBeenCalledTimes(60);
    expect(afterEach[0]).toHaveBeenCalledTimes(60);
    expect(response.res.result).toMatch("OK");
  });
});
