import { Wristband } from "./Wristband.js";
import * as aferrs from "agent_factory.shared/errors.js";

class LiveWristband extends Wristband {
  constructor(Afmachine, wristband = {}) {
    super(wristband);
    this.Afmachine = Afmachine;

    this.unsubscribeWristbandScan = null;
    this.releaseScanHandle = null;
    this.togglers = 0;
    this.nextPairing = true;
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
    return Promise.resolve();
  }

  async scan() {
    try {
      this.releaseScanHandle = this.Afmachine.lockWristbandScan();
      const response = await this.Afmachine.getWristbandScan({
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
    return this.Afmachine.verifyWristband(wristband)
      .then(this.state.verified.bind(this, null))
      .catch(this.state.verified.bind(this));
  }

  register(wristband) {
    return this.Afmachine.registerWristband(wristband)
      .then(this.state.registered.bind(this, null))
      .catch(this.state.registered.bind(this));
  }

  unregister(wristband, state = true) {
    return state
      ? this.Afmachine.unregisterWristband(wristband)
          .then(this.state.unregistered.bind(this, null))
          .catch(this.state.unregistered.bind(this))
      : this.Afmachine.unregisterWristband(wristband);
  }

  pair() {
    return this.scan().then((wristband) => {
      this.fill(wristband);
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

export { LiveWristband };
