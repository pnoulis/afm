import { Player } from "../player/index.js";
import { extractPlayers } from "../../utils/extractPlayers.js";
import { MAX_TEAM_SIZE } from "agent_factory.shared/constants.js";

function random(source, { depth = 0, size = 0 } = {}) {
  const players = extractPlayers(source);
  if (size < players.length) {
    size = players.length;
  }
  for (let i = 0; i < size; i++) {
    players[i] = Player.random(players[i], { depth });
  }
  return players;
}

export { random };
