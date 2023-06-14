// import { describe, it, expect, vi } from "vitest";
import { mockBackendServer } from "./mocks/mockBackendServer.js";
import { backend as backendClient } from "../src/index.js";
import { toClient as BACKEND_TOPICS } from "agent_factory.shared/backend_topics.js";

// backendClient
//   .publish("/player/login", { username: "pavlos" })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => console.log(err));

for (const { alias } of BACKEND_TOPICS) {
  console.log(alias);
  backendClient
    .publish(alias, {})
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
}
// backendClient.publish("/player/login", {});
// backendClient.publish("/player/register", {});

// describe("mock backend server", () => {
//   it("Should work for all routes", async () => {
//     for (const { alias } of BACKEND_TOPICS) {
//       await expect(backendClient.publish(alias, {})).resolves.toMatchObject({
//         result: "OK",
//         message: "MOCK_SERVER_UP",
//       });
//     }
//   });
// });
