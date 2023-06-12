import { State } from "./State.js";

class Pairing extends State {
  constructor(wristband) {
    super(wristband);
  }

  handleWristbandScan(err, wristband) {
    if (err) {
      this.wristband.emit("error", err);
    } else {
      this.wristband.unregisterScanListener();
      this.wristband.number = wristband.wristbandNumber;
      this.wristband.color = wristband.wristbandColor;
      this.wristband.changeState(this.wristband.getScannedState);
    }
  }

  togglePairing(cb) {
    this.wristband.unregisterScanListener();
    this.wristband.flush('scanned', "player_scan");
    this.wristband.changeState(this.wristband.getEmptyState, cb);
  }
}

export { Pairing };
