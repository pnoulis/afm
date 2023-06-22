import { backendClientService } from "../client.js";

/**
 * Successful player registration payload.

 * @typedef {Object} SuccessFulPlayerRegistrationPayload
 * @property {string} result - OK
 * @property {Object} player
 * @property {string} player.name
 * @property {string} player.surname
 * @property {string} player.username
 * @property {string} player.email
 */

/**
 * Failed player registration payload.
 *
 * @typedef {Object} FailedPlayerRegistrationPayload
 * @property {string} result - NOK
 * @property {string} [message] - The cause of failure in case of a NOT validation error.
 * @property {Object.<string,*>} validationErrors - In case of validation errors.
 */

/**
 * Register Player
 *
 * @param {Object} player
 * @param {string} player.username
 * @param {string} player.name
 * @param {string} player.email
 * @param {string} [player.password]
 *
 * @returns {Promise<SuccessFulPlayerRegistrationPayload>}
 * @throws {ModelError || ValidationError}
 */

function registerPlayer(player) {
  return backendClientService.publish("/player/register", player);
}

export { registerPlayer };
