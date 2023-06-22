import { backendClientService } from "../client.js";

/**
 * Successful package removal payload
 *
 * @typedef {Object} SuccessPayload
 */

/**
 * Failed package removal payload
 *
 * @typedef {Object} FailurePayload
 */

/**
 * Remove package from team
 *
 * @param {Object} payload
 * @param {string} payload.teamName
 * @param {number || string} payload.packageId
 *
 * @returns {Promise<BackendTeam>}
 * @throws {ModelError}
 */
function removePackage(payload) {
  return backendClientService.publish("/team/package/delete", payload);
}

export { removePackage };
