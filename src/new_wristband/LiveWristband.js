import { Wristband } from "./Wristband.js";
import { eventful } from "js_utils/eventful";
import * as aferrs from "agent_factory.shared/errors.js";

class LiveWristband extends Wristband {
  constructor(Afmachine, wristband = {}) {
    super(wristband);

    // Eventful initialization
    eventful.construct.call(this);

    this.Afmachine = Afmachine;

    this.unsubscribeWristbandScan = null;
    this.releaseScanHandle = null;
    this.toggles = 0;
    this.nextPairing = true;
  }

  supersedeAction() {
    return Promise.reject(new aferrs.ERR_SUPERSEDED_ACTION());
  }

  unscan() {
    this.number = null;
    this.color = "";
    this.colorCode = null;
    this.active = false;
    if (typeof this.unsubscribeWristbandScan === "function") {
      console.log("will unsubscribe wristband scan");
      this.unsubscribeWristbandScan();
    }
    if (typeof this.releaseScanHandle === "function") {
      console.log("releasing scan handle");
      this.releaseScanHandle();
    }
    return Promise.resolve();
  }

  async scan() {
    try {
      this.releaseScanHandle = this.Afmachine.lockWristbandScan();
      const response = await this.Afmachine.getWristbandScan({
        unsubcb: (unsub) => {
          console.log("unsub callabck being called");
          if (this.inState("pairing")) {
            this.unsubscribeWristbandScan && this.unsubscribeWristbandScan();
            this.unsubscribeWristbandScan = unsub;
          } else {
            console.log("unsubscribing");
            unsub();
            this.releaseScanHandle();
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
    return this.Afmachine.verifyWristband(wristband)
      .then((res) => this.state.verified(null, res))
      .catch((err) => this.state.verified(err));
  }

  register(wristband) {
    return this.Afmachine.registerWristband(wristband)
      .then((res) => this.state.registered(null, res))
      .catch((err) => this.state.registered(err));
  }

  unregister(wristband, state = true) {
    return state
      ? this.Afmachine.unregisterWristband(wristband)
          .then((res) => this.state.unregistered(null, res))
          .catch((err) => this.state.unregistered(err))
      : this.Afmachine.unregisterWristband(wristband);
  }

  pair() {
    return this.scan().then(({ number, color, colorCode, active }) => {
      this.number = number;
      this.colorCode = colorCode;
      this.color = color;
      this.active = active;
      this.setState(this.getPairedState);
    });
  }

  unpair() {
    return this.unscan();
  }

  // interface
  /*
    Where cb signature: (err, pairing, wristband) => {}
   */
  toggle(cb) {
    this.togglers += 1;
    this.nextPairing = !this.nextPairing;
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
          if (this.inState("unpaired")) {
            this.emit("unpaired", this);
          } else {
            this.emit("paired", this);
          }
        }
        cb && cb(error, this.inState("pairing"), this);
      });
  }
}

// Eventful
eventful(Wristband, ["stateChange", "paired", "unpaired", "error"]);

export { LiveWristband };
