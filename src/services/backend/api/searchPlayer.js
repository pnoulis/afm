import { backendClientService } from "../client.js";

/**
 * Successful player search payload
 *
 * @typedef {Object} SuccessPayload
 * @property {string} result - OK
 * @property {Array} players
 */

/**
 * Failed player search payload
 *
 * @typedef {Object} FailurePayload
 * @property {string} result - NOK
 */

/**
 * Search player
 *
 * @param {Object} payload
 * @param {string} payload.searchTerm
 * @returns {Promise} SuccessPayload or FailurePayload
 * @throws {TimeoutError}
 **/

function searchPlayer(payload) {
  return backendClientService.publish("/player/search", payload);
}

export { searchPlayer };
