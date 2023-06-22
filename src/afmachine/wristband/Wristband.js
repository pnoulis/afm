import { eventful } from "../eventful.js";
import { stateful } from "../stateful.js";
import { Empty } from "./StateEmpty.js";
import { Pairing } from "./StatePairing.js";
import { Scanned } from "./StateScanned.js";
import { Paired } from "./StatePaired.js";
import { subscribeWristbandScan } from "../subscriptions.js";

class Wristband {
  static wristbandScanSubscription = subscribeWristbandScan();
  static wristbandScanHandler = null;
  static colors = [
    "black",
    "red",
    "purple",
    "green",
    "yellow",
    "blue",
    "orange",
  ];
  static initialize(wristband, config) {
    wristband.number = config.wristbandNumber || null;
    wristband.color = config.wristbandColor || null;
    wristband.active = config.active ?? false;

    if (wristband.number && wristband?.active) {
      wristband.setState(wristband.getPairedState);
    } else if (this.number) {
      wristband.setState(wristband.getScannedState);
    } else {
      wristband.setState(wristband.getEmptyState);
    }
  }

  constructor(wristband = {}) {
    Object.assign(
      this,
      stateful.call(this, {
        empty: new Empty(this),
        pairing: new Pairing(this),
        scanned: new Scanned(this),
        paired: new Paired(this),
      })
    );

    Object.assign(
      this,
      eventful.call(this, {
        stateChange: [],
        scanned: [],
        error: [],
      })
    );

    Wristband.initialize(this, wristband);
  }

  changeState(state, cb) {
    const previousState = this.state.name;
    this.setState(state, () => {
      this.emit("stateChange", this.state.name, previousState);
      cb && cb();
    });
  }

  registerScanListener() {
    this.constructor.wristbandScanSubscription.register(
      this.handleWristbandScan.bind(this),
      {
        id: "oneWristbandListenerPerSession",
      }
    );
  }

  unregisterScanListener() {
    this.constructor.wristbandScanSubscription.flush(
      "message",
      "oneWristbandListenerPerSession"
    );
  }

  handleWristbandScan(err, wristband) {
    this.state.handleWristbandScan(err, wristband);
  }

  getColor(code) {
    return code ? this.color : Wristband.colors[this.color];
  }

  /* INTERFACE */
  scan(cb) {
    this.constructor.wristbandScanHandler = cb;
    this.state.scan(cb);
  }
  verify() {}
  register(player) {}
  unregister(player) {}
  unpair(player) {}
}

export { Wristband };
