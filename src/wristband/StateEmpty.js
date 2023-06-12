import { State } from "./State.js";

class Empty extends State {
  constructor(wristband) {
    super(wristband);
  }

  togglePairing(cb) {
    this.wristband.registerScanListener();
    this.wristband.once("scanned", cb, { id: "player_scan" });
    this.wristband.changeState(this.wristband.getPairingState);
  }
}

export { Empty };
