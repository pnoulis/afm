import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { AsyncAction, errs } from "../../src/afmachine/async_action/index.js";

/*
  DEPENDENCIES
 */
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../scripts/randomWristband";
import { randomPlayer } from "../../scripts/randomPlayer.js";
import { emulateScan } from "../../scripts/emulateScan.js";
import { backendClientService } from "../../src/services/backend/client.js";
// import * as Errors from "../../src/misc/errors.js";
import { delay } from "js_utils/misc";
import * as ROUTES_BACKEND from "../../src/routes/backend/routesBackend.js";

beforeAll(async () => {
  await backendClientService.init();
});

describe("AsyncActions", () => {
  it("Should instantiate an async action object", () => {
    const aa = new AsyncAction();
    expect(aa).toBeInstanceOf(AsyncAction);
  });
  it("Should begin at the Idle state", () => {
    const aa = new AsyncAction();
    expect(aa.inState("idle")).toBeTruthy();
  });
  it("Should successfully resolve an async action", async () => {
    const aa = new AsyncAction(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(() => resolve("OK"), 1000);
        })
    );
    await expect(aa.fire()).resolves.toBe("OK");
  });
  it("fire() while pending or idle should not actually invoke the async action multiple times, but instead buffer them", async () => {
    const spyAction = vi.fn((count) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(count), 0);
      });
    });
    const aa = new AsyncAction(spyAction);
    const iters = [];
    for (let i = 0; i < 100; i++) {
      iters[i] = aa.fire(i);
    }
    for (let i = 100; i < 200; i++) {
      iters[i] = aa.fire(i);
    }

    for (let i = 200; i < 300; i++) {
      iters[i] = aa.fire(i);
    }

    for (let i = 300; i < 400; i++) {
      iters[i] = aa.fire(i);
    }

    for (let i = 400; i < 500; i++) {
      iters[i] = aa.fire(i);
    }

    await iters.at(-1);
    let res;
    while (iters.length > 0) {
      res = await iters.pop();
      expect(res).toBe(0);
    }
    expect(spyAction).toHaveBeenCalledOnce();
  });
  it.only("Should only fire() when Idle or Pending", async () => {
    const spyAction = vi.fn((count) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(count), 0);
      });
    });
    const aa = new AsyncAction(spyAction);
    expect(aa.inState("idle")).toBe(true);
    // fire when idle
    aa.fire();
    expect(aa.inState("pending")).toBe(true);

    // fire when pending
    await aa.fire();
    expect(aa.inState("resolved"));

    // throw error at Resolved
    expect(aa.fire()).rejects.toThrowError(errs.ERR_AA_FIRE_SETTLED);

    // throw error at Rejected
  });
});
