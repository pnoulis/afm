import { describe, it, expect, vi } from "vitest";
import { mockBackendServer } from "agent_factory.shared/mocks/mockBackendServer.js";
import { backendClient } from "../../src/services/backend/client.js";
import { toClient as BACKEND_TOPICS } from "agent_factory.shared/backend_topics.js";

function getTopicsExcept(...args) {
  return BACKEND_TOPICS.filter(
    ({ alias }) => !args.some((exclude) => exclude === alias)
  );
}

describe("mock backend server", () => {
  it("Should respond successfully to all requests", async () => {
    for (const { pub } of getTopicsExcept("/wristband/scan")) {
      await expect(backendClient.publish(pub, "msg")).resolves.toMatchObject({
        result: "OK",
        message: "MOCK_SERVER_UP",
      });
    }
  }, 20000);
  it("Should allow for succeeding or failing the next response", async () => {
    mockBackendServer.fail();
    await expect(
      backendClient.publish("/player/register", {})
    ).resolves.toMatchObject({
      result: "NOK",
    });

    mockBackendServer.fail({
      result: "NOK",
      message: "controlledFailure",
    });

    await expect(
      backendClient.publish("/player/login", {})
    ).resolves.toMatchObject({
      result: "NOK",
      message: "controlledFailure",
    });

    mockBackendServer.succeed();
    await expect(
      backendClient.publish("/player/register", {})
    ).resolves.toMatchObject({
      result: "OK",
    });

    mockBackendServer.succeed({
      result: "OK",
      message: "controlledSuccess",
    });

    await expect(
      backendClient.publish("/player/login", {})
    ).resolves.toMatchObject({
      result: "OK",
      message: "controlledSuccess",
    });
  });
});
