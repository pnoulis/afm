/**
 * Backend Request.
 *
 * The rest of the properties of a backend request are dependent
 * on the specific route and request instance.
 *
 * @typedef {Object.<string, *>} BackendRequest
 * @property {string} topic - Mqtt topic.
 */

/**
 * Backend Response.
 *
 * Only the result and timestamp property are guaranteed to be
 * part of every backend response. The rest of the contents referred to as
 * (payload) are dependent on the specific route, instance and status.
 *
 * @typedef {Object.<string, *>} BackendResponse
 * @property {string} result - OK || NOK
 * @property {string} timestamp
 *
 */

/**
 * Backend error.
 *
 * @typedef {Error} BackendError
 * @property {string} name
 * @property {string} message
 * @property {number} code
 * @property {Object} cause
 * @property {BackendRequest} cause.req  - The request that led to this error.
 * @property {BackendResponse} cause.res - The backend response.
 */

/**
 * A RouteTransaction represents the complete sequence of events related to
 * performing a backend request.
 *
 * The order of execution is:
 * <br>1. Runs middleware defined to run before the backend request.
 * <br>2. Runs the backend request.
 * <br>3. Runs middleware defined to run after the backend request.
 * <br>4. Rejects or Resolves.
 *
 * @typedef {Promise} RouteTransaction
 * @returns {BackendResponse} - In case of a successful route transaction.
 * @throws {BackendError} In case of a failed route transaction.
 */

/**
 * Backend Wristband
 * @typedef {Object} BackendWristband
 * @property {number} wristbandNumber
 * @property {number} wristbandColor
 * @property {boolean} [active]
 */

/**
 * Frontend Wristband
 * @typedef {Object} FrontendWristband
 * @property {number} number
 * @property {number} color
 * @property {boolean} [active]
 */

/**
 * Backend Player
 *
 * @typedef {Object} BackendPlayer
 * @property {string} name
 * @property {string} surname
 * @property {string} username
 * @property {string } email
 *
 */

/**
 * Backend Team
 *
 * @typedef {Object} BackendTeam
 * @property {string} name - Name of the team
 * @property {number} totalPoints
 * @property {string} teamState
 * @property {Object} currentRoster
 * @property {number} currentRoster.version
 * @property {Array<Object>} players
 * @property {Object} players.player
 **/
