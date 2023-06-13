import { LOGGER } from "./config.js";

function logBackendResponse(topic = "", req = {}) {
  return (res) => {
    LOGGER.debug({ req, res }, topic);
    return res;
  };
}

function logBackendError(topic = "", req = {}, consumeError = false) {
  return (err) => {
    LOGGER.error({ req, err }, topic);
    if (!consumeError) {
      throw err;
    }
  };
}

function logStateChange(currentState, previousState) {
  LOGGER.debug(`[TRANSITION] ${previousState} -> ${currentState}`);
}
function logSubscriptionDisconnected(subscription) {
  LOGGER.debug(`[SUBSCRIPTION] ${subscription.topic} DISCONNECTED`);
}
function logSubscriptionConnected(subscription) {
  LOGGER.debug(`[SUBSCRIPTION] ${subscription.topic} CONNECTED`);
}
function logSubscriptionMessage(err, msg, subscription) {
  LOGGER.debug(`[SUBSCRIPTION] ${subscription.topic} MESSAGE`);
}
function logSubscriptionError(err, subscription) {
  LOGGER.error(err, `[SUBSCRIPTION] ${subscription.topic} ERROR`);
}

function attachLogsSubscription(subscription) {
  subscription.on("stateChange", logStateChange);
  subscription.on("disconnected", logSubscriptionDisconnected);
  subscription.on("connected", logSubscriptionConnected);
  subscription.on("message", logSubscriptionMessage);
  subscription.on("error", logSubscriptionError);
  return subscription;
}

export {
  logStateChange,
  logSubscriptionConnected,
  logSubscriptionDisconnected,
  logSubscriptionError,
  logSubscriptionMessage,
  attachLogsSubscription,
  logBackendResponse,
  logBackendError,
};
