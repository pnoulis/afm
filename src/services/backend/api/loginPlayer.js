import { backendClientService } from "../client.js";

/**
 * Failed player login payload.
 *
 * @typedef {Object} FailedPlayerLogin
 * @property {string} [message] - The cause of failure in case of a NOT validation error.
 * @property {Object.<string,*>} validationErrors - In case of a validation error the
 * object shall be populated with
 *
 * @example <caption>Example of a payload received at failed player login </caption>
 *
 * result: "NOK"
 * message: 'Unrecognized field email'
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
  return backendClientService.publish("/player/login", player);
}

export { loginPlayer };
