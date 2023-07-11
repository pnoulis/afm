import { State } from "./State.js";

class Pairing extends State {
  constructor(wristband) {
    super(wristband);
  }

  handleWristbandScan(err, wristband) {
    if (err) {
      this.wristband.constructor.scanHandler(err, this.wristband);
    } else {
      this.wristband.number = wristband.number;
      this.wristband.color = wristband.color;
      this.wristband.active = wristband.active;
      this.wristband.changeState(this.wristband.getScannedState);
      this.wristband.constructor.scanHandler(
        null,
        this.wristband.unregisterScanListener()
      );
    }
  }

  scan() {
    this.wristband.unregisterScanListener();
    this.wristband.changeState(this.wristband.getEmptyState);
  }
  verify() {}
  register(player) {}
  unregister(player) {}
  unpair(player) {}
}

export { Pairing };
