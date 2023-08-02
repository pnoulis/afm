import { Player, PersistentPlayer } from "../../entities/player/index.js";
import { Wristband } from "../../entities/wristband/index.js";

/**
 * Search player
 * @param {...Object} arguments
 * @param {Object} request
 * @param {string} request.searchTerm
 */
function searchPlayer(afmachine) {
  return [
    "/player/search",
    // Argument parsing and validation
    async function (context, next) {
      const { searchTerm = "" } = context.args;
      context.req = {
        timestamp: Date.now(),
        searchTerm: searchTerm,
      };
      await next();
    },
    // search player
    async (context, next) => {
      context.res = await afmachine.services.backend.searchPlayer(context.req);
      await next();
    },
    // generic backend response parsing
    afmachine.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to search player ${context.req.searchTerm}`,
          reason: err.message,
        };
        throw err;
      }

      const { players = [] } = context.res;

      for (let i = 0; i < players.length; i++) {
        players[i] = Player.normalize(
          {
            ...players[i],
          },
          { state: "registered" },
        );
        if (players[i].wristband.state === "paired") {
          players[i].wristband.state = "registered";
        }
      }

      context.res.payload = {
        ok: true,
        data: players,
      };
      await next();
    },
  ];
}

export { searchPlayer };
