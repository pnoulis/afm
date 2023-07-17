import * as aferrs from "agent_factory.shared/errors.js";

let lock = false;

function lockWristbandScan() {
  if (lock) throw new aferrs.ERR_WRISTBAND_LOCK();
  lock = true;
  return function () {
    lock = !lock;
  };
}

export { lockWristbandScan };
