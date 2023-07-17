import { eventful } from "js_utils/eventful";
import { stateful } from "js_utils/stateful";
import { Empty } from "./StateEmpty.js";
import { Pairing } from "./StatePairing.js";
import { Scanned } from "./StateScanned.js";
import { Verified } from "./StateVerified.js";
import { Paired } from "./StatePaired.js";
import * as aferrs from "agent_factory.shared/errors.js";

class Wristband {
  constructor(Afmachine, wristband = {}) {
    // Eventful initialization
    eventful.construct.call(this);
    // Stateful Initialization
    stateful.construct.call(this);
    // Agent Factory
    this.Afmachine = Afmachine;
    // Wristband Initialization
    this.number = wristband.number || null;
    this.color = wristband.color || null;
    this.active = wristband.active ?? false;
    if (this.active) {
      this.setState(this.getPairedState);
    } else if (this.number) {
      this.setState(this.getScannedState);
    }
    this.unsubscribeWristbandScan = null;
    this.releaseScanHandle = null;
    this.togglers = 0;
    this.nextPairing = true;
  }

  supersedeAction() {
    return Promise.reject(new aferrs.ERR_SUPERSEDED_ACTION());
  }

  unscan() {
    this.number = null;
    this.color = null;
    this.active = false;
    if (typeof this.unsubscribeWristbandScan === "function") {
      this.unsubscribeWristbandScan();
    }
    if (typeof this.releaseScanHandle === "function") {
      this.releaseScanHandle();
    }
    return Promise.resolve();
  }

  async scan() {
    try {
      this.releaseScanHandle = this.Afmachine.lockWristbandScan();
      const response = await this.Afmachine.getWristbandScan((unsub) => {
        if (this.inState("pairing")) {
          this.unsubscribeWristbandScan = unsub;
        } else {
          unsub();
          this.releaseScanHandle();
        }
      });
      return this.state.scanned(null, response);
    } catch (err) {
      return this.state.scanned(
        err instanceof aferrs.ERR_UNSUBSCRIBED
          ? new aferrs.ERR_SUPERSEDED_ACTION()
          : err,
      );
    }
  }

  async verify(wristband) {
    try {
      const response = await this.Afmachine.verifyWristband(wristband);
      return this.state.verified(null, response);
    } catch (err) {
      return this.state.verified(err);
    }
  }

  async unregister(payload, state = true) {
    try {
      const response = await this.Afmachine.unregisterWristband(this.player, {
        ...this.player.wristband,
        ...payload,
      });
      if (state) {
        return this.state.unregistered(null, response);
      }
    } catch (err) {
      if (state) {
        return this.state.unregistered(err);
      }
    }
  }

  async register(wristband) {
    try {
      const response = await this.Afmachine.registerWristband(
        this.player,
        wristband,
      );
      return this.state.registered(null, response);
    } catch (err) {
      return this.state.registered(err);
    }
  }

  // Each subclass shadows/re-implements this.
  pair() {
    return this.scan().then(({ number, color, active }) => {
      this.number = number;
      this.color = color;
      this.active = active ?? false;
      this.setState(this.getScannedState);
    });
  }

  // interface
  togglePair(cb) {
    this.togglers += 1;
    this.nextPairing = !this.nextPairing;
    let error;
    this.state
      .togglePair()
      .catch((err) => {
        this.emit("error", err);
        error = err;
        if (!this.nextPairing && this.inState("pairing")) {
          this.setState(this.getEmptyState);
        }
      })
      .finally(() => {
        this.togglers -= 1;
        if (!this.togglers) {
          if (this.inState("empty")) {
            this.emit("unpaired", this);
          } else {
            this.emit("paired", this);
          }
        }
        cb && cb(error, !this.inState("empty"), this);
      });
  }
}

// Stateful
stateful(Wristband, [
  Empty,
  "empty",
  Pairing,
  "pairing",
  Scanned,
  "scanned",
  Verified,
  "verified",
  Paired,
  "paired",
]);

// Eventful
eventful(Wristband, ["stateChange", "paired", "unpaired", "error"]);

export { Wristband };
