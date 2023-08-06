import { DEFAULT_CLIENT_SESSION_ID } from "agent_factory.shared/constants.js";

function getStatistics(afmachine) {
  return [
    "/statistics",
    async function(context, next) {
      // initialize stats
      context.stats = {};
      await next();
    },
    async function(context, next) {
      context.teams = await afmachine.services.backend.listTeams({
        timestamp: Date.now(),
      });
      await next();
    },
    async function(context, next) {
    }
  ];
}
export { getStatistics };
