import { loginPlayer as __loginPlayer } from "../backend/actions/index.js";

function loginPlayer(player) {
  return __loginPlayer(player);
}

export { loginPlayer };
