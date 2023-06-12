import { eventful } from "../eventful.js";
import { stateful } from "../stateful.js";
import { Empty } from "./StateEmpty.js";
import { Pairing } from "./StatePairing.js";
import { Scanned } from "./StateScanned.js";
import { Paired } from "./StatePaired.js";

class Wristband {
  static colors = [
    "black",
    "red",
    "purple",
    "green",
    "yellow",
    "blue",
    "orange",
  ];

  static subscription = null;
  static hydrate(backendWristband) {
    const wristband = {
      number: backendWristband.wristbandNumber,
      color: backendWristband.wristbandColor,
      active: backendWristband.active ?? false,
    };
  }

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
    const currentState = this.state.name;
    this.setState(state, () => {
      this.emit("stateChange", this.state.name, currentState);
      cb && cb();
    });
  }

  registerScanListener() {
    Wristband.subscription.register(this.handleWristbandScan.bind(this), {
      id: "singleton",
    });
  }

  unregisterScanListener() {
    Wristband.subscription.flush("message", "singleton");
  }

  handleWristbandScan(err, wristband) {
    this.state.handleWristbandScan(err, wristband);
  }

  getColor(code) {
    return code ? this.color : Wristband.colors[this.color];
  }

  pair() {}
  unpair() {}
  verify() {}

  /* INTERFACE */
  togglePairing(cb) {
    this.state.togglePairing(cb);
  }
}

export { Wristband };
