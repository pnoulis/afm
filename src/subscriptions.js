import backend from "./backend/backend.js";
import { Subscription } from "./subscription/index.js";

function subscribeWristbandScan(options = {}) {
  return new Subscription(backend, "/wristband/scan", options);
}

export { subscribeWristbandScan };
