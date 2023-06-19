import { describe, it, expect, vi } from "vitest";
import { mockBackendServer } from "./mocks/mockBackendServer.js";
import backendClientService from "../src/backend/backend.js";
import { toClient as BACKEND_TOPICS } from "agent_factory.shared/backend_topics.js";

function getTopicsExcept(...args) {
  return BACKEND_TOPICS.filter(
    ({ alias }) => !args.some((exclude) => exclude === alias)
  );
}

describe("mock backend server", () => {
  it("Should successfully boot", async () => {
    await expect(backendClientService.init()).resolves.toMatchObject({
      result: "OK",
    });
  });
  it("Should respond successfully to all requests", async () => {
    for (const { alias } of getTopicsExcept("/wristband/scan")) {
      await expect(
        backendClientService.publish(alias, {})
      ).resolves.toMatchObject({
        result: "OK",
        message: "MOCK_SERVER_UP",
      });
    }
  });
  it("Should allow for succeeding or failing the next response", async () => {
    mockBackendServer.fail();
    await expect(
      backendClientService.publish("/player/register", {})
    ).resolves.toMatchObject({
      result: "NOK",
    });

    mockBackendServer.fail({
      result: "NOK",
      message: "controlledFailure",
    });

    await expect(
      backendClientService.publish("/player/login", {})
    ).resolves.toMatchObject({
      result: "NOK",
      message: "controlledFailure",
    });

    mockBackendServer.succeed();
    await expect(
      backendClientService.publish("/player/register", {})
    ).resolves.toMatchObject({
      result: "OK",
    });

    mockBackendServer.succeed({
      result: "OK",
      message: "controlledSuccess",
    });

    await expect(
      backendClientService.publish("/player/login", {})
    ).resolves.toMatchObject({
      result: "OK",
      message: "controlledSuccess",
    });
  });
});
