import { eventful } from "js_utils/eventful";
import { stateful } from "js_utils/stateful";
import { Empty } from "./StateEmpty.js";
import { Scanned } from "./StateScanned.js";
import { Pairing } from "./StatePairing.js";
import { Unpairing } from "./StateUnpairing.js";
import { Paired } from "./StatePaired.js";
import { CreateBackendService } from "agent_factory.shared/services/backend/CreateBackendService.js";

const bservice = CreateBackendService();

class Wristband2 {
  constructor(wristband = {}) {
    // Stateful Initialization
    stateful.construct.call(this);

    // Wristband Initialization
    this.number = wristband.number;
    this.color = wristband.color;
    this.active = wristband.active ?? false;
    if (this.active) {
      this.setState(this.getPairedState);
    } else if (this.number) {
      this.setState(this.getScannedState);
    }
    this.actionQueue = [];
  }

  pair() {
    bservice
      .onceWristbandScan((err, wristband) => {
        if (this.inState("pairing")) {
          if (err) {
            this.setstate(this.getEmptyState);
            this.emit("togglePair", err);
          } else {
            this.number = wristband.wristbandNumber;
            this.color = wristband.wristbandColor;
            this.setState(this.getPairedState);
            this.emit("togglePair", null, this);
          }
        } else if (typeof this.unsubscribeWristbandScan === "function") {
          this.unsubscribeWristbandScan();
        }
      })
      .then((unsubscribe) => {
        if (this.inState("pairing")) {
          this.unsubscribeWristbandScan = unsubscribe;
        } else {
          unsubscribe();
        }
      })
      .catch((err) => {
        this.setState(this.getEmptyState);
        this.emit("togglePair", err);
      });
  }

  unpair() {
    if (typeof this.unsubscribeWristbandScan === "function") {
      this.unsubscribeWristbandScan();
    }
    this.emit("togglePair", null, this);
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
stateful(Wristband2, [
  Empty,
  "empty",
  Scanned,
  "scanned",
  Pairing,
  "pairing",
  Unpairing,
  "unpairing",
  Paired,
  "paired",
]);

// Eventful
eventful(Wristband2, {
  stateChange: [],
  togglePair: [],
});

export { Wristband2 };
