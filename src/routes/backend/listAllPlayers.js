import { Player } from "../../entities/player/index.js";
import { Wristband } from "../../entities/wristband/index.js";

function listAllPlayers(afmachine) {
  return [
    "/players/list/all",
    // list all players
    async (context, next) => {
      context.res = await afmachine.services.backend.listAllPlayers();
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // request parsing and response builder
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to fetch players with a registered wristband",
          reason: err.message,
        };
        throw err;
      }
      const { players = [] } = context.res;
      for (let i = 0; i < players.length; i++) {
        players[i] = Player.normalize(players[i], { state: "registered" });
      }
      context.res.payload = {
        ok: true,
        data: players,
      };
      await next();
    },
  ];
}

export { listAllPlayers };
