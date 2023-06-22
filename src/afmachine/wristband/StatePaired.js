import { State } from "./State.js";

class Paired extends State {
  constructor(wristband) {
    super(wristband);
  }

  scan(cb) {
    // throw error, wristband is scanned already, first need to unpair();
  }
  verify() {}
  register(player) {}
  unregister(player) {}
  unpair(player) {}
}

export { Paired };
