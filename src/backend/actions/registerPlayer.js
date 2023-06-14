import backend from "../backend.js";

/**
 * Failed player registration payload.
 *
 * @typedef {Object} FailedPlayerRegistration
 * @property {string} [message] - The cause of failure in case of a NOT validation error.
 * @property {Object.<string,*>} validationErrors
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
 * @returns {Promise<RouteTransaction>} - In case of {@link FailedPlayerRegistration}
 * rejects with a {@link BackendError}.
 * Otherwise it resolves with a {@link @BackendPlayer}.
 */

function routeRegisterPlayer(player) {
  return backend.publish("/player/register", player);
}

export default routeRegisterPlayer;
