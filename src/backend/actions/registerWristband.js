import backend from "../backend.js";

/**
 * Successful wristband registration payload.
 *
 * @typedef {Object} SuccessPayload
 * @property {string} result - OK
 * @property {string} message - successfull registered...
 *
 */

/**
 * Failed wristband registration payload.
 *
 * @typedef {Object} FailurePayload
 * @property {string} result - NOK
 */

/**
 * Register wristband
 *
 * @param {Object} payload
 * @param {string} payload.username
 * @param {string} payload.wristbandNumber
 *
 * @returns {Promise<SuccessPayload || FailurePayload>}
 * @throws {ModelError}
 */
function registerWristband(payload) {
  return backend.publish("/wristband/register", payload);
}

export { registerWristband };
