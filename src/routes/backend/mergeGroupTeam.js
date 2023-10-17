import { Team } from "../../entities/team/index.js";
import { Roster } from "../../entities/roster/index.js";

function mergeGroupTeam(afmachine) {
  return [
    "/groupteam/merge",
    // Argument parsing and validation
    async function (context, next) {
      context.team = context.args;
      context.req = {
        timestamp: Date.now(),
        teamName: context.team.name?.trim(),
        groupPlayers: context.team.roster.asObject().map((player) => ({
          username: player.username,
          wristbandNumber: player.wristband.id,
        })),
      };
      await next();
    },
    // Merge group team
    async (context, next) => {
      context.res = await afmachine.services.backend.mergeGroupTeam(
        context.req,
      );
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to merge group team ${context.team.name}`,
          reason: err.message,
        };
        throw err;
      }

      const data = Team.normalize(context.team, { state: "merged" });
      context.res.payload = {
        ok: true,
        msg: `Merged group team ${context.team.name}`,
        data: data,
      };
      await next();
    },
  ];
}

function onMergeGroupTeam(afmachine) {
  return [
    "/groupteam/merge",
    // argument parsing and validation
    async function (context, next) {
      // listener
      context.req = context.args.listener;
      if (typeof context.req !== "function") {
        throw new TypeError("onMergeGroupTeam listener function missing");
      }
      await next();
    },
    // subscribe merge team message
    async (context, next) => {
      context.res = afmachine.services.backend.onMergeGroupTeam(context.req);
      await next();
    },
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to subscribe to group team merge topic",
          reason: err.message,
        };
        throw err;
      }
      context.res.payload = {
        ok: true,
        // unsubscribe function
        data: context.res,
      };
      await next();
    },
  ];
}

export { mergeGroupTeam, onMergeGroupTeam };
