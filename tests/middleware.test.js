import { describe, it, expect, vi, beforeAll } from "vitest";
import {
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
  it("Should provide a global error handler", async () => {
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

    await route({ name: "yolo" });
    expect(introduceRoute).toHaveBeenCalledTimes(1);
    expect(concludeRoute).toHaveBeenCalledTimes(0);
    expect(afterCalling).toHaveBeenCalledTimes(0);
    expect(beforeCalling).toHaveBeenCalledTimes(1);
  });

  it("Should allow custom error handlers", async () => {
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
    const afterCalling = vi.fn(async (context, next, err) => {
      console.log("CUSTOM ERROR HANDLER");
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

    await route({ name: "yolo" });
    expect(introduceRoute).toHaveBeenCalledTimes(1);
    expect(concludeRoute).toHaveBeenCalledTimes(0);
    expect(afterCalling).toHaveBeenCalledTimes(1);
    expect(beforeCalling).toHaveBeenCalledTimes(1);
  });
  it("Should allow error chainining", async () => {
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
      async (context, next, err) => {
        console.log("CUSTOM ERROR HANDLER");
        await next(err);
      }
    );

    await route({ name: "yolo" });
    expect(introduceRoute).toHaveBeenCalledTimes(1);
    expect(concludeRoute).toHaveBeenCalledTimes(0);
    expect(afterCalling).toHaveBeenCalledTimes(0);
    expect(beforeCalling).toHaveBeenCalledTimes(1);
  });
  it.only("Should expect errors within error handlers", async () => {
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
      async (err, context, next) => {
        console.log("CUSTOM ERROR HANDLER");
        throw new Error("yololooll");
        // await next(err);
      }
    );

    await route({ name: "yolo" });
    expect(introduceRoute).toHaveBeenCalledTimes(1);
    expect(concludeRoute).toHaveBeenCalledTimes(0);
    expect(afterCalling).toHaveBeenCalledTimes(0);
    expect(beforeCalling).toHaveBeenCalledTimes(1);
  });
});
