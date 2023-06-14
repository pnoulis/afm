// import { describe, it, expect, vi } from "vitest";
import { mockBackendServer } from "./mocks/mockBackendServer.js";
import backendClientService from "../src/backend/backend.js";
import { toClient as BACKEND_TOPICS } from "agent_factory.shared/backend_topics.js";


// backendClientService.init();
mockBackendServer.fail();
mockBackendServer.succeed();
backendClientService.init();

// for (const { alias, sub } of BACKEND_TOPICS) {
//   backendClientService.publish(alias, {});
// }

// describe("mock", () => {
//   it("Should respond with a failed transaction when directed to", async () => {
//     mockBackendServer.fail();
//     await expect(
//       backendClientService.publish("/player/login", "yolo")
//     ).resolves.toMatchObject({
//       result: "NOK",
//     });
//   });
// });
