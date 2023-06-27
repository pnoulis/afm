import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { AsyncAction } from "../../src/afmachine/async_action/AsyncAction.js";

/*
  DEPENDENCIES
 */
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../scripts/randomWristband";
import { randomPlayer } from "../../scripts/randomPlayer.js";
import { emulateScan } from "../../scripts/emulateScan.js";
import { backendClientService } from "../../src/services/backend/client.js";
import * as Errors from "../../src/misc/errors.js";
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
  it("Should change from Idle -> Pending -> Resolve -> Idle", async () => {
    const aa = new AsyncAction(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(() => resolve("OK"), 1000);
        })
    );
    expect(aa.inState("idle")).toBeTruthy();
    aa.fire();
    expect(aa.inState("pending")).toBeTruthy();
    await expect(aa.fire()).resolves.toBe("OK");
    expect(aa.inState("idle")).toBeTruthy();
  });
  it.only("Should not matter how many times the asyncAction is fired()", async () => {
    const aa = new AsyncAction(
      (count) =>
        new Promise((resolve, reject) => {
          setTimeout(() => resolve(count), 0);
        })
    );
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
  });
});
