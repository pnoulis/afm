import backend from "../backend.js";

/**
 * Failed player login payload.
 *
 * @typedef {Object} FailedPlayerLogin
 * @property {string} [message] - The cause of failure in case of a NOT validation error.
 * @property {Object.<string,*>} validationErrors
 *
 */

/**
 * Login player
 *
 * @param {Object} player
 * @param {string} player.username
 * @param {string} [player.password=""]
 *
 * @returns {Promise<RouteTransaction>} - In case of a {@link FailedPlayerLogin}
 * the promise shall reject with a {@link BackendError}. If successful
 * the promise shall resolve with a {@link @BackendPlayer }.
 *
 **/
function routeLoginPlayer(player) {
  return backend.publish("/player/login", player);
}

export default routeLoginPlayer;
