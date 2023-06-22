import { describe, it, expect, vi, beforeAll } from "vitest";
import {
  registerGlobalErrorHandler,
  beforeEachMiddleware,
  afterAllMiddleware,
  afterEachMiddleware,
  beforeAllMiddleware,
  clearAll,
  Route,
} from "../src/routes/Router.js";
import { listRegisteredPlayers } from "../src/backend/actions/index.js";
import backendClientService from "../src/backend/backend.js";

beforeAll(async () => {
  await backendClientService.init();
});

beforeEach(() => {
  clearAll();
});

describe("router", () => {
  it("Should return a function", () => {
    const route = new Route("/some/route", () => {});
    expect(route).toBeTypeOf("function");
  });
  it("Should allow the creation of dynamic middleware pipelines", () => {
    const fone = vi.fn((context, next) => {
      console.log("FONE");
      next();
    });
    const ftwo = vi.fn((context, next) => {
      console.log("FTWO");
      next();
    });
    const fthree = vi.fn((context, next) => {
      console.log("FTHREE");
      next();
    });
    const fallbefore1 = vi.fn((context, next) => {
      console.log("fallbefore1");
      next();
    });
    const fallbefore2 = vi.fn((context, next) => {
      console.log("fallbefore2");
      next();
    });
    const fallafter1 = vi.fn((context, next) => {
      console.log("fallafter1");
      next();
    });
    const fallafter2 = vi.fn((context, next) => {
      console.log("fallafter2");
      next();
    });
    const feachbefore1 = vi.fn((context, next) => {
      console.log("feachbefore1");
      next();
    });
    const feachbefore2 = vi.fn((context, next) => {
      console.log("feachbefore2");
      next();
    });
    const feachafter1 = vi.fn((context, next) => {
      console.log("feachafter1");
      next();
    });
    const feachafter2 = vi.fn((context, next) => {
      console.log("feachafter2");
      next();
    });
    const route = new Route("/some/route", fone, ftwo, fthree);

    beforeEachMiddleware(feachbefore1, feachbefore2);
    afterAllMiddleware(fallafter1, fallafter2);
    afterEachMiddleware(feachafter1, feachafter2);
    beforeAllMiddleware(fallbefore1, fallbefore2);

    route({});
    route({});
    const route2 = new Route("/some/router", fone);
    route2({});
    route2({});
    expect(fone).toHaveBeenCalledTimes(4);
    expect(ftwo).toHaveBeenCalledTimes(2);
    expect(fthree).toHaveBeenCalledTimes(2);
    expect(fallbefore1).toHaveBeenCalledTimes(4);
    expect(fallbefore2).toHaveBeenCalledTimes(4);
    expect(fallafter1).toHaveBeenCalledTimes(4);
    expect(fallafter2).toHaveBeenCalledTimes(4);
    expect(feachbefore1).toHaveBeenCalledTimes(8);
    expect(feachbefore2).toHaveBeenCalledTimes(8);
    expect(feachafter1).toHaveBeenCalledTimes(8);
    expect(feachafter2).toHaveBeenCalledTimes(8);
  });
  it("Should allow skipping globally registered middleware", () => {
    const fone = vi.fn((context, next) => {
      console.log("FONE");
      next();
    });
    const ftwo = vi.fn((context, next) => {
      console.log("FTWO");
      next();
    });
    const fthree = vi.fn((context, next) => {
      console.log("FTHREE");
      next();
    });
    const fallbefore1 = vi.fn((context, next) => {
      console.log("fallbefore1");
      next();
    });
    const fallbefore2 = vi.fn((context, next) => {
      console.log("fallbefore2");
      next();
    });
    const fallafter1 = vi.fn((context, next) => {
      console.log("fallafter1");
      next();
    });
    const fallafter2 = vi.fn((context, next) => {
      console.log("fallafter2");
      next();
    });
    const feachbefore1 = vi.fn((context, next) => {
      console.log("feachbefore1");
      next();
    });
    const feachbefore2 = vi.fn((context, next) => {
      console.log("feachbefore2");
      next();
    });
    const feachafter1 = vi.fn((context, next) => {
      console.log("feachafter1");
      next();
    });
    const feachafter2 = vi.fn((context, next) => {
      console.log("feachafter2");
      next();
    });

    beforeEachMiddleware(feachbefore1, feachbefore2);
    afterAllMiddleware(fallafter1, fallafter2);
    afterEachMiddleware(feachafter1, feachafter2);
    beforeAllMiddleware(fallbefore1, fallbefore2);

    const route = new Route("/some/route", fone, ftwo, fthree);
    route.skipAll({});
    route.skipAll({});
    const route2 = new Route("/some/route", fone);
    route2.skipAll({});
    route2.skipAll({});
    expect(fone).toHaveBeenCalledTimes(4);
    expect(ftwo).toHaveBeenCalledTimes(2);
    expect(fthree).toHaveBeenCalledTimes(2);
    expect(fallbefore1).toHaveBeenCalledTimes(0);
    expect(fallbefore2).toHaveBeenCalledTimes(0);
    expect(fallafter1).toHaveBeenCalledTimes(0);
    expect(fallafter2).toHaveBeenCalledTimes(0);
    expect(feachbefore1).toHaveBeenCalledTimes(0);
    expect(feachbefore2).toHaveBeenCalledTimes(0);
    expect(feachafter1).toHaveBeenCalledTimes(0);
    expect(feachafter2).toHaveBeenCalledTimes(0);
  });
  it("Should persist changes in the context along the middleware chain", async () => {
    const fone = vi.fn(async (context, next) => {
      console.log("FONE");
      context.req.payload.count++;
      console.log(context);
      await next();
    });
    const ftwo = vi.fn(async (context, next) => {
      console.log("FTWO");
      context.req.payload.count++;
      console.log(context);
      await next();
    });
    const fthree = vi.fn(async (context, next) => {
      console.log("FTHREE");
      context.req.payload.count++;
      console.log(context);
      await next();
    });
    const fallbefore1 = vi.fn(async (context, next) => {
      console.log("fallbefore1");
      context.req.payload.count++;
      console.log(context);
      await next();
    });
    const fallbefore2 = vi.fn(async (context, next) => {
      console.log("fallbefore2");
      context.req.payload.count++;
      console.log(context);
      await next();
    });
    const fallafter1 = vi.fn(async (context, next) => {
      console.log("fallafter1");
      context.req.payload.count++;
      console.log(context);
      await next();
    });
    const fallafter2 = vi.fn(async (context, next) => {
      console.log("fallafter2");
      context.req.payload.count++;
      console.log(context);
      await next();
    });
    const feachbefore1 = vi.fn(async (context, next) => {
      console.log("feachbefore1");
      context.req.payload.count++;
      console.log(context);
      await next();
    });
    const feachbefore2 = vi.fn(async (context, next) => {
      console.log("feachbefore2");
      context.req.payload.count++;
      console.log(context);
      await next();
    });
    const feachafter1 = vi.fn(async (context, next) => {
      console.log("feachafter1");
      context.req.payload.count++;
      console.log(context);
      await next();
    });
    const feachafter2 = vi.fn(async (context, next) => {
      console.log("feachafter2");
      context.req.payload.count++;
      console.log(context);
      await next();
    });

    beforeEachMiddleware(feachbefore1, feachbefore2);
    afterAllMiddleware(fallafter1, fallafter2);
    afterEachMiddleware(feachafter1, feachafter2);
    beforeAllMiddleware(fallbefore1, fallbefore2);

    const route = new Route("/some/route", fone, ftwo, fthree);
    await expect(route({ count: 0 })).resolves.toMatchObject({
      req: {
        route: "/some/route",
        payload: {
          count: 19,
        },
      },
    });
  });
  it("Invoking the function should return a Promise", () => {
    const route = new Route("/some/route", () => {});
    expect(route()).toBeInstanceOf(Promise);
  });
  it("Should resolve with a context object", async () => {
    const route = new Route("/some/route", async (context, next) => {
      // do nothing
      return;
    });
    await expect(route({})).resolves.toMatchObject({
      req: {},
      res: {},
    });
  });
  it("Should reject with an error", async () => {
    const route = new Route("/some/route", async (context, next) => {
      throw new Error("yolo");
    });
    await expect(route()).rejects.toThrowError("yolo");
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
    const route = new Route("/some/route", async function (context, next) {
      console.log("listing registered players");
      let players;
      try {
        players = await listRegisteredPlayers();
        console.log("after listing registered players");
        context.res.players = players.players;
        next();
      } catch (err) {
        console.log(err);
      }
      console.log("leaving listing");
    });

    await expect(route()).resolves.toMatchObject({
      res: {
        players: expect.any(Array),
      },
    });
    expect(introduceRoute).toHaveBeenCalledTimes(1);
    expect(concludeRoute).toHaveBeenCalledTimes(1);
    expect(afterCalling).toHaveBeenCalledTimes(1);
    expect(beforeCalling).toHaveBeenCalledTimes(1);
  });
  it("Should handle asynchronous errors", async () => {
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
    const route = new Route(
      "/some/route",
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
      response = await route();
    } catch (err) {
      response = err;
    }
    expect(response).toBeInstanceOf(Error);
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
    const route = new Route(
      "/some/route",
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
    const route = new Route(
      "/some/route",
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
    const route = new Route(
      "/some/route",
      async function (context, next) {
        await listRegisteredPlayers();
        throw new Error("some error");
      },
      customErrHandler
    );

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
  it("Should handle large pipelines", async () => {
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

    const route = new Route(
      "/some/route",
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
