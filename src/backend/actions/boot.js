/**
 * Successful client boot payload
 *
 * @typedef {Object} SuccessfulClientBoot
 * @property {string} result - OK
 * @property {string} deviceType
 * @property {string} roomName
 */

/**
 * Boot client
 *
 * The deviceId forms a segment of the topic prefix that represents a unique
 * channel of communication between the client and the backend server.
 *
 * @param {Object} clientInfo
 * @param {string} clientInfo.deviceId
 * @param {string} clientInfo.roomName
 * @param {string} clientInfo.deviceType
 *
 * @returns {Promise<SuccessfulClientBoot>}
 * @throws {ModelError}
 */

function boot(backend) {
  return (clientInfo) => backend.publish("/boot", clientInfo);
}

export { boot };
