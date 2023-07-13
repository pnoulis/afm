import { eventful } from "js_utils/eventful";
import { stateful } from "js_utils/stateful";
import { Empty } from "./StateEmpty.js";
import { Pairing } from "./StatePairing.js";
import { Scanned } from "./StateScanned.js";
import { Verified } from "./StateVerified.js";
import { Paired } from "./StatePaired.js";
import * as werrs from "./errors.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { Afmachine } from "../../index.js";

class Wristband {
  constructor(wristband = {}) {
    // Stateful Initialization
    stateful.construct.call(this);

    // Wristband Initialization
    this.number = wristband.number || null;
    this.color = wristband.color || null;
    this.active = wristband.active ?? false;
    if (this.active) {
      this.setState(this.getPairedState);
    } else if (this.number) {
      this.setState(this.getScannedState);
    }
    this.togglers = 0;
    this.unsubscribeWristbandScan = null;
  }

  supersedeAction() {
    return Promise.reject(new werrs.ERR_SUPERSEDED_ACTION());
  }

  unscan() {
    try {
      if (typeof this.unsubscribeWristbandScan === "function") {
        this.unsubscribeWristbandScan();
      }
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      this.number = null;
      this.color = null;
      this.active = false;
    }
  }

  async scan() {
    try {
      const response = await Afmachine.getWristbandScan((unsub) => {
        if (this.inState("pairing")) {
          this.unsubscribeWristbandScan = unsub;
        } else {
          unsub();
        }
      });
      return this.state.scanned(null, response);
    } catch (err) {
      return this.state.scanned(
        err instanceof aferrs.ERR_UNSUBSCRIBED
          ? new werrs.ERR_SUPERSEDED_ACTION()
          : err,
      );
    }
  }

  async verify(wristband) {
    try {
      const response = await Afmachine.verifyWristband(wristband);
      return this.state.verified(null, response);
    } catch (err) {
      return this.state.verified(err);
    }
  }

  async unregister(payload, state = true) {
    try {
      const response = await Afmachine.unregisterWristband({
        username: this.player.username,
        number: this.number,
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
      const response = await Afmachine.registerWristband(
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
    let error;
    this.state
      .togglePair()
      .catch((err) => {
        this.emit("error", err);
        error = err;
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
        cb(error, !this.inState("empty"), this);
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
eventful(Wristband, {
  stateChange: [],
  paired: [],
  unpaired: [],
  error: [],
});

export { Wristband };
