import { backendClientService } from "../client.js";

function listRegisteredPlayers() {
  return backendClientService.publish("/players/list");
}

export { listRegisteredPlayers };
