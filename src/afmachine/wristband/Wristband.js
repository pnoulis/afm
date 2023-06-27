import { eventful } from "../../misc/eventful.js";
import { stateful } from "../../misc/stateful.js";
import { Empty } from "./StateEmpty.js";
import { Pairing } from "./StatePairing.js";
import { Scanned } from "./StateScanned.js";
import { Paired } from "./StatePaired.js";
import { subscribeWristbandScan } from "../../routes/backend/routesBackend.js";

subscribeWristbandScan({
  listener: function (err, wristband) {
    console.log(Wristband);
    if (typeof Wristband.__listener === "function") {
      Wristband.__listener(err, wristband);
    }
  },
});

class Wristband {
  static __listener = null;
  static scanHandler = null;
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

  unregisterScanListener() {
    this.constructor.__listener = null;
    this.constructor.scanHandler = null;
    return this;
  }

  handleWristbandScan(err, wristband) {
    this.state.handleWristbandScan(err, wristband);
  }

  getColor(code) {
    return code ? this.color : Wristband.colors[this.color];
  }
  verify() {}

  /* INTERFACE */
  scan(cb) {
    this.constructor.__listener = this.handleWristbandScan.bind(this);
    this.constructor.scanHandler = cb;
    this.state.scan();
  }
  pair() {}
  unpair() {}
  register() {}
  unregister() {}
  // register(player) {
  //   return this.state.register(player);
  // }
  // unregister(player) {}
  // unpair(player) {}
}

export { Wristband };
