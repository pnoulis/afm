import { backendClientService } from "../client.js";

/**
 * Successful listing of available teams
 *
 * @typedef {Object} SuccessPayload
 * @property {string} result - OK
 * @property {Array} teams
 **/

/**
 * List available teams.
 *
 * @returns {Promise} - SuccessPayload
 * @throws {TimeoutError}
 **/
function listTeams() {
  return backendClientService.publish("/teams/all");
}

export { listTeams };
