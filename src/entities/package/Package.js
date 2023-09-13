import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { normalize } from "./normalize.js";
import { random } from "./random.js";
import { New } from "./StateNew.js";
import { Registered } from "./StateRegistered.js";
import { Playing } from "./StatePlaying.js";
import { Paused } from "./StatePaused.js";
import { Completed } from "./StateCompleted.js";
import * as aferrs from "agent_factory.shared/errors.js";

class Package {
  static name = "package";
  static normalize = normalize;
  static random = random;

  constructor(afmachine, pkg, team) {
    pkg ??= {};
    team ??= {};
    // Eventful initialization
    eventful.construct.call(this);
    // Stateful initialization
    stateful.construct.call(this);
    this.afmachine = afmachine;
    this.team = team;
    this.id = pkg.id ?? null;
    this.name = pkg.name || "";
    this.type = pkg.type || "";
    this.amount = pkg.amount ?? null;
    this.cost = pkg.cost ?? null;
    this.t_start = pkg.t_start ?? null;
    this.t_end = pkg.t_end ?? null;
    this.remainder = pkg.remainder ?? null;
    if (pkg.state) {
      this.setState(pkg.state);
    }
  }
}
Package.prototype.start = function () {};
Package.prototype.pause = function () {};
Package.prototype.register = function () {};
Package.prototype.unregister = function () {};
Package.prototype.pay = function () {};

Package.prototype.blockState = function (action, async = false) {
  if (async) {
    return Promise.reject(
      new aferrs.ERR_STATE_ACTION_BLOCK(
        this.state.name,
        this.constructor.name,
        action,
      ),
    );
  } else {
    throw new aferrs.ERR_STATE_ACTION_BLOCK(
      this.state.name,
      this.constructor.name,
      action,
    );
  }
};
Package.prototype.log = function () {
  console.log("------------------------------");
  console.log("name: ", this.name);
  console.log("type: ", this.type);
  console.log("amount: ", this.amount);
  console.log("cost: ", this.cost);
  console.log("------------------------------");
};
Package.prototype.asObject = function () {
  return {
    name: this.name,
    type: this.type,
    amount: this.amount,
    cost: this.cost,
    started: this.started,
    ended: this.ended,
    remainder: this.remainder,
    state: this.state,
  };
};

// Stateful
(() => {
  let extended = false;
  return () => {
    if (extended) return;
    extended = true;
    stateful(Package, [
      New,
      "new",
      Registered,
      "registered",
      Playing,
      "playing",
      Paused,
      "paused",
      Completed,
      "completed",
    ]);
  };
})()();

// Eventful
(() => {
  let extended = false;
  return () => {
    if (extended) return;
    extended = true;
    eventful(Package, ["stateChange", "change"]);
  };
})()();

export { Package };
