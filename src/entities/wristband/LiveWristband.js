import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Wristband } from "./Wristband.js";
import { Unpaired } from "./StateUnpaired.js";
import { Pairing } from "./StatePairing.js";
import { Paired } from "./StatePaired.js";
import { Registered } from "./StateRegistered.js";
import * as aferrs from "agent_factory.shared/errors.js";

class LiveWristband extends Wristband {
  constructor(afmachine, wristband) {
    wristband ??= {};
    // initialize ancestor
    super(wristband);
    // Eventful initialization
    eventful.construct.call(this);
    // Stateful initialization
    stateful.construct.call(this);
    // afmachine
    this.afmachine = afmachine;
    if (wristband.state) {
      this.setState(wristband.state);
    }
    this.unsubscribeWristbandScan = null;
    this.releaseScanHandle = null;
    this.togglers = 0;
  }

  fill(...args) {
    super.fill(...args);
    this.bootstrap();
    this.emit("change");
    return this;
  }

  supersedeAction() {
    return Promise.reject(new aferrs.ERR_SUPERSEDED_ACTION());
  }

  unscan() {
    this.id = null;
    this.color = null;
    if (typeof this.unsubscribeWristbandScan === "function") {
      this.unsubscribeWristbandScan();
      this.unsubscribeWristbandScan = null;
    }
    if (typeof this.releaseScanHandle === "function") {
      this.releaseScanHandle();
      this.releaseScanHandle = null;
    }
    this.setState(this.getUnpairedState);
    return Promise.resolve(this);
  }

  async scan() {
    try {
      this.releaseScanHandle = this.afmachine.lockWristbandScan();
      const response = await this.afmachine.getWristbandScan({
        unsubcb: (unsub) => {
          if (this.inState("pairing")) {
            if (typeof this.unsubscribeWristbandScan === "function") {
              this.unsubscribeWristbandScan();
              this.unsubscribeWristbandScan = null;
            }
            this.unsubscribeWristbandScan = unsub;
          } else {
            unsub();
            if (typeof this.releaseScanHandle === "function") {
              this.releaseScanHandle();
              this.releaseScanHandle = null;
            }
          }
        },
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

  verify(wristband) {
    return this.afmachine
      .verifyWristband(wristband)
      .then(this.state.verified.bind(this, null))
      .catch(this.state.verified.bind(this));
  }

  register(wristband) {
    return this.afmachine
      .registerWristband(wristband)
      .then(this.state.registered.bind(this, null))
      .catch(this.state.registered.bind(this));
  }

  unregister(wristband, state = true) {
    console.log(this);
    console.log(wristband);
    console.log('WILL UNREGISTER WRISTBAND');
    return state
      ? this.afmachine
          .unregisterWristband(wristband || this)
          .then(this.state.unregistered.bind(wristband || this, null))
          .catch(this.state.unregistered.bind(wristband || this))
      : this.afmachine.unregisterWristband(wristband || this);
  }

  // interface
  /*
    Where cb signature: (err, pairing, wristband) => {}
   */
  toggle(cb) {
    this.togglers += 1;
    let error;
    this.state
      .toggle()
      .catch((err) => {
        if (!(err instanceof aferrs.ERR_SUPERSEDED_ACTION)) {
          this.emit("error", err);
          error = err;
        }
      })
      .finally(() => {
        this.togglers -= 1;
        if (this.togglers <= 0) {
          if (typeof this.releaseScanHandle === "function") {
            this.releaseScanHandle();
            this.releaseScanHandle = null;
          }
          if (error && this.inState("pairing")) {
            this.setState(this.getUnpairedState);
          }
        }
        cb && cb(error, this.inState("pairing"), this);
      });
  }
}

LiveWristband.prototype.bootstrap = function () {
  this.setState(this.state);
};

// Stateful
(() => {
  let extended = false;
  return () => {
    if (extended) return;
    extended = true;
    stateful(LiveWristband, [
      Unpaired,
      "unpaired",
      Pairing,
      "pairing",
      Paired,
      "paired",
      Registered,
      "registered",
    ]);
  };
})()();

// Eventful
(() => {
  let extended = false;
  return () => {
    if (extended) return;
    extended = true;
    eventful(LiveWristband, ["stateChange", "change"]);
  };
})()();

export { LiveWristband };
