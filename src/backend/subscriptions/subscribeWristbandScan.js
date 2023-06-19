import backend from "../backend.js";

/**
 * Wristband scan listener callback
 * @callback wristbandScanListener
 * @param {error} error
 * @param {Object} backendWristband
 * @param {number} backendWristband.wristbandNumber
 * @param {number} backendWristband.wristbandColor
 */

/**
 * Subscribe wristband scan
 *
 * @param {wristbandScanListener} listener - Message handler
 * @param {Object} options
 * @param {string} options.mode - If persistent keep the channel
 * open until unsubscription.
 * @returns {Promise<SuccessfullSubscription>}
 * @throws {FailedSubscription}
 */

function subscribeWristbandScan(listener, options = { mode: "persistent" }) {
  return backend.subscribe("/wristband/scan", options, listener);
}

export { subscribeWristbandScan };
