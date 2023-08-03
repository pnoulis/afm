import { Player } from "../player/index.js";
import { extractPlayers } from "../../utils/extractPlayers.js";
/**
 * @example
 * [ [] [] ]
 * @example
 * [ Roster, Roster ]
 * @example
 * [ { roster: [] } ]
 * @example
 * [ { roster: Roster }]
 */
function normalize(sources, options = {}) {
  sources ??= [];
  options ??= {
    state: "",
    defaultState: "",
    nulls: false,
  };
  const players = extractPlayers(sources);
  const matchingPlayers = new Map();
  let player;
  for (let i = 0; i < players.length; i++) {
    player = matchingPlayers.get(players[i].username);
    if (player) {
      player.push(players[i]);
    } else {
      matchingPlayers.set(players[i].username, [players[i]]);
    }
  }
  const normalizedPlayers = [];
  for (const __ of matchingPlayers.values()) {
    normalizedPlayers.push(Player.normalize(__, options));
  }
  return normalizedPlayers;
}

export { normalize };
