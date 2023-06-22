import { State } from "./State.js";

class Empty extends State {
  constructor(wristband) {
    super(wristband);
  }

  scan() {
    this.wristband.registerScanListener();
    this.wristband.changeState(this.wristband.getPairingState);
  }
  verify() {}
  register(player) {}
  unregister(player) {}
  unpair(player) {}
}

export { Empty };
