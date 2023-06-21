import backend from "../backend.js";

function listRegisteredPlayers() {
  return backend.publish("/players/list");
}

export { listRegisteredPlayers };
