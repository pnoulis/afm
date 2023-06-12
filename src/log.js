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

export { logBackendResponse, logBackendError };
