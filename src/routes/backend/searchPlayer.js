import { Player } from "../../entities/player/Player.js";

/**
 * Search player
 * @param {...Object} arguments
 * @param {Object} request
 * @param {string} request.searchTerm
 */
function searchPlayer() {
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
      context.res = await this.services.backend.searchPlayer(context.req);
      await next();
    },
    // generic backend response parsing
    this.middleware.parseResponse,
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

      const lnPlayers = players.length;
      for (let i = 0; i < lnPlayers; i++) {
        players[i] = new Player(Player.normalize(players[i], "registered"))
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
