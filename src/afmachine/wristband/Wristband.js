import { eventful } from "../../misc/eventful.js";
import { stateful } from "../../misc/stateful.js";
import { Empty } from "./StateEmpty.js";
import { Pairing } from "./StatePairing.js";
import { Unpairing } from "./StateUnpairing.js";
import { Paired } from "./StatePaired.js";
import {
  getWristbandScan,
  registerWristband,
  unregisterWristband,
  infoWristband,
} from "../../routes/backend/routesBackend.js";
import { AsyncAction, errs as aaerrs } from "../async_action/index.js";

/*
  Wristband
 */

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
    // stateful
    Object.assign(
      this,
      stateful.call(this, {
        empty: new Empty(this),
        pairing: new Pairing(this),
        unpairing: new Unpairing(this),
        paired: new Paired(this),
      })
    );

    // eventful
    Object.assign(
      this,
      eventful.call(this, {
        stateChange: [],
      })
    );

    // targets
    const targets = [];
    // Initialize wristband state
    Wristband.initialize(this, wristband);
  }

  changeState(state, cb) {
    const previousState = this.state.name;
    this.setState(state, () => {
      this.emit("stateChange", this.state.name, previousState);
      cb && cb();
    });
  }

  getColor(code) {
    return code ? this.color : Wristband.colors[this.color];
  }

  pair() {
    switch (this.state.name) {
      case "empty":
        this.targets.push(
          new AsyncAction(
            function () {
              return getWristbandScan()
                .then(infoWristband)
                .then(registerWristband);
            }.bind(this)
          )
        );
      case "unpairing":
      default:
        this.emit("togglePair");
    }
  }

  /* INTERFACE */
  togglePair(player) {
    this.player = player;
    return new Promise((resolve, reject) => {
      this.once("togglePair", (err, wristband) => {
        if (err) reject(err);
        else resolve(wristband);
      });
      this.state.togglePair();
    });
  }
}

export { Wristband };
