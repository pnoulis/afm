import backend from "../backend.js";

/**
 * Failed player login payload.
 *
 * @typedef {Object} FailedPlayerLogin
 * @property {string} [message] - The cause of failure in case of a NOT validation error.
 * @property {Object.<string,*>} validationErrors - In case of a validation error the
 * object shall be populated with
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
 * the promise shall resolve with a {@link BackendPlayer }.
 *
 **/
function loginPlayer(player) {
  return backend.publish("/player/login", player);
}

export { loginPlayer };
