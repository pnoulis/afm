import { eventful } from "../../misc/eventful.js";
import { stateful } from "../../misc/stateful.js";
import { Empty } from "./StateEmpty.js";
import { Scanned } from "./StateScanned.js";
import { Pairing } from "./StatePairing.js";
import { Unpairing } from "./StateUnpairing.js";
import { Paired } from "./StatePaired.js";
import { getWristbandScan } from "../../routes/backend/routesBackend.js";
import { AsyncAction } from "../async_action/index.js";

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
        scanned: new Scanned(this),
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
        togglePair: [],
      })
    );

    // action queue
    // example:
    // togglePair() -> actionQueue[action]
    // second togglePair() -> actionQueue[action1, action2]
    // ...
    this.actionQueue = [];
    this.lastAction = null;
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

  isStaleAction() {
    // action is NOT stale if it is the only one in the queue
    if (this.actionQueue.length < 1) {
      return false;
      // action is NOT stale if it shares the same target with the last action
    } else if (
      this.actionQueue.at(0).target === this.actionQueue.at(-1).target
    ) {
      return false;
    }
    // stale
    return true;
  }

  runActionsQueueUntilEmpty(cb) {
    if (cb != null) {
      this.lastAction = cb;
    }
    if (!this.actionQueue.every((action) => action.recipie.inState("idle"))) {
      return;
    }
    this.actionQueue
      .at(-1)
      .recipie.fire()
      .then((response) => {
        if (this.isStaleAction()) {
          this.actionQueue.splice(0, this.actionQueue.length - 1);
          this.runActionsQueueUntilEmpty();
        } else {
          this.lastAction(response);
        }
      });
  }

  paired(response) {
    this.number = response.number;
    this.color = response.color;
    this.active = response.active;
  }

  unpaired(response) {
    this.number = null;
    this.color = null;
    this.active = false;
  }

  unpair() {
    this.actionQueue.push({
      target: this.getEmptyState.name,
      recipie: new AsyncAction(() => {
        return Promise.resolve();
      }),
    });
    this.runActionsQueueUntilEmpty((response) => {
      this.unpaired(response);
      this.changeState(this.getEmptyState);
    });
  }
  pair() {
    this.actionQueue.push({
      target: this.getScannedState.name,
      recipie: new AsyncAction(() => {
        return getWristbandScan();
      }),
    });

    this.runActionsQueueUntilEmpty((response) => {
      this.paired(response);
      this.changeState(this.getScannedState);
    });
  }

  /* INTERFACE */
  togglePair() {
    return new Promise((resolve, reject) => {
      this.once("togglePair", function (err, wristband) {
        err ? reject(err) : resolve(wristband);
      });
      this.state.togglePair();
    });
  }
}

export { Wristband };
