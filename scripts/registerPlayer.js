import { backendClientService } from "../src/services/backend/client.js";
import { registerPlayer as __registerPlayer } from "../src/services/backend/api/registerPlayer.js";
import { randomPlayer } from "./randomPlayer.js";

backendClientService.init();
async function registerPlayer(n = 1) {
  const players = [];

  for await (const player of [__registerPlayer(randomPlayer()), __registerPlayer(randomPlayer())]) {
    players.push(player);
    console.log(players);
  }
  return players;
}

export { registerPlayer };
