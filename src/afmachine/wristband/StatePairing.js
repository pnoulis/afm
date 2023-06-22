import { State } from "./State.js";

class Pairing extends State {
  constructor(wristband) {
    super(wristband);
  }

  handleWristbandScan(err, wristband) {
    if (err) {
      this.wristband.emit("error", err);
    } else {
      this.wristband.number = wristband.wristbandNumber;
      this.wristband.color = wristband.wristbandColor;
      this.wristband.emit("scanned", wristband);
      this.wristband.unregisterScanListener();
      this.wristband.changeState(this.wristband.getScannedState);
      this.wristband.constructor.wristbandScanHandler(err, wristband);
    }
  }

  scan() {
    this.wristband.unregisterScanListener();
    this.wristband.changeState(this.wristband.getEmptyState, cb);
  }
  verify() {}
  register(player) {}
  unregister(player) {}
  unpair(player) {}
}

export { Pairing };
