import { eventful } from "../../misc/eventful.js";
import { stateful } from "../../misc/stateful.js";
import { Empty } from "./StateEmpty.js";
import { Scanned } from "./StateScanned.js";
import { Pairing } from "./StatePairing.js";
import { Unpairing } from "./StateUnpairing.js";
import { Paired } from "./StatePaired.js";
import { getWristbandScan } from "../../routes/backend/routesBackend.js";
import { AsyncAction } from "../async_action/index.js";

class Wristband2 {
  constructor(wristband = {}) {
    // Stateful Initialization
    this.statefulConstructor();

    // Wristband Initialization
    this.number = wristband.number;
    this.color = wristband.color;
    this.active = wristband.active ?? false;
    if (this.active) {
      this.setState(this.getPairedState);
    } else if (this.number) {
      this.setState(this.getScannedState);
    }

    // async actions
    this.wristbandScan = new AsyncAction(getWristbandScan);
    this.actionQueue = [];
    this.lastAction = null;
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
    for (let i = 0; i < this.actionQueue.length; i++) {
      if (!this.actionQueue[i].recipie.inState("idle")) {
        return;
      }
    }

    this.actionQueue
      .at(-1)
      .recipie.fire()
      .then((res) => {
        if (this.isStaleAction()) {
          this.actionQueue.splice(0, this.actionQueue.length - 1);
          this.runActionsQueueUntilEmpty();
        } else {
          this.lastAction(null, res);
        }
      })
      .catch(this.lastAction.bind(this));
  }

  unpair() {
    this.actionQueue.push({
      target: this.getEmptyState.name,
      recipie: new AsyncAction(() => {
        return Promise.resolve();
      }),
    });

    this.runActionsQueueUntilEmpty((err, res) => {
      if (err) {
        return this.emit("togglePair", err);
      }
      this.number = null;
      this.color = null;
      this.active = false;
      this.setState(this.getEmptyState);
      this.emit("togglePair", err, this);
    });
  }

  pair() {
    this.actionQueue.push({
      target: this.getScannedState.name,
      recipie: new AsyncAction(() => {
        if (!this.wristbandScan.inState("idle")) {
          this.wristbandScan.reset();
        }
        return this.wristbandScan.fire();
      }),
    });

    this.runActionsQueueUntilEmpty((err, res) => {
      if (err) {
        return this.emit("togglePair", err);
      }

      this.number = res.number;
      this.color = res.color;
      this.active = res.active;
      this.setState(this.getScannedState);
      this.emit("togglePair", null, this);
    });
  }

  // interface
  togglePair() {
    return new Promise((resolve, reject) => {
      this.once("togglePair", function (err, wristband) {
        err ? reject(err) : resolve(wristband);
      });
      this.state.togglePair();
    });
  }
}

// Stateful
stateful(Wristband2, {
  empty: Empty,
  scanned: Scanned,
  pairing: Pairing,
  unpairing: Unpairing,
  paired: Paired,
});

// Eventful
eventful(Wristband2, {
  stateChange: [],
  togglePair: [],
});

export { Wristband2 };
