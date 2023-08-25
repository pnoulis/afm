import { Player } from "../../entities/player/index.js";
import { Wristband } from "../../entities/wristband/index.js";

function listRegisteredWristbandPlayers(afmachine) {
  return [
    "/players/list/available",
    // Argument parsing, validation and request builder
    async function (context, next) {
      context.req = {
        timestamp: Date.now(),
      };
      await next();
    },
    // list those players that have paired and registered
    // their wristband
    async (context, next) => {
      context.res = await afmachine.services.backend.listWristbandPlayers(
        context.req,
      );
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
      console.log(players);
      for (let i = 0; i < players.length; i++) {
        players[i] = Player.normalize(players[i], { state: "registered" });
        players[i].wristband.state = "registered";
      }
      context.res.payload = {
        ok: true,
        data: players,
      };
      await next();
    },
  ];
}

export { listRegisteredWristbandPlayers };
