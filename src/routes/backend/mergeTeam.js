import { Team } from "../../entities/team/index.js";
import { Roster } from "../../entities/roster/index.js";

/**
 * @example
 * Input:
 * ```
 * {
 * name: "string",
 * roster: [ "string", "string" ],
 * }
 *`
 * @example
 * Input:
 *```
 *{
 * name: "string",
 * roster: [ { username: "string" }, { username: "string"}]
 *}
 *`
 *
 * @example
 * Input:
 *```
 * Team{
 * roster: Roster{
 * get()
 *}
 *}
 *`
 */
function mergeTeam(afmachine) {
  return [
    "/team/merge",
    // Argument parsing and validation
    async function (context, next) {
      context.team = context.args;
      context.req = {
        timestamp: Date.now(),
        teamName: context.team.name,
        usernames:
          context.team.roster instanceof Roster
            ? context.team.roster.get().map((p) => p.username)
            : context.team.roster.map((p) =>
                typeof p === "string" ? p : p.username,
              ),
      };
      await next();
    },

    // Merge team
    async (context, next) => {
      context.res = await afmachine.services.backend.mergeTeam(context.req);
      await next();
    },
    // generic backend response parser
    afmachine.middleware.parseResponse,
    // specific backend response parsing
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: `Failed to merge team ${context.team.name}`,
          reason: err.message,
        };
        throw err;
      }

      const data = Team.normalize(context.team, { state: "merged" });
      context.res.payload = {
        ok: true,
        msg: `Merged team ${context.team.name}`,
        data: data,
      };
      await next();
    },
    afmachine.middleware.statisticMergedTeams,
  ];
}

function onMergeTeam(afmachine) {
  return [
    "/team/merge",
    // argument parsing and validation
    async function (context, next) {
      // listener
      context.req = context.args.listener;
      if (typeof context.req !== "function") {
        throw new TypeError("onMergeTeam listener function missing");
      }
      await next();
    },
    // subscribe merge team message
    async (context, next) => {
      context.res = afmachine.services.backend.onMergeTeam(context.req);
      await next();
    },
    async function (context, next, err) {
      if (err) {
        context.res.payload = {
          ok: false,
          msg: "Failed to subscribe to team merge topic",
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

export { mergeTeam, onMergeTeam };
