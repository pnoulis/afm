import { eventful } from 'js_utils/eventful';
import { stateful } from 'js_utils/stateful';
import { Idle } from "./StateIdle.js";
import { Pending } from "./StatePending.js";
import { Resolved } from "./StateResolved.js";
import { Rejected } from "./StateRejected.js";

class AsyncAction {
  #tminus0 = 0;
  constructor(
    action,
    {
      fireDelay = 0,
      minTimePending = 0,
      minTimeResolving = 0,
      minTimeRejecting = 0,
    } = {},
  ) {
    // Stateful Initialization
    stateful.construct.call(this);

    // AsyncAction Initialization
    this.options = {
      fireDelay,
      minTimePending,
      minTimeResolving,
      minTimeRejecting,
    };

    this.timeoutId = undefined;
    this.exec = action;
    this.response = null;
  }

  set tminus0(count) {
    this.#tminus0 = Date.now() + count;
  }

  isT0() {
    return Date.now() >= this.#tminus0;
  }

  startCountdown(event, cb) {
    clearTimeout(this.timeoutId);
    if (event === 0) {
      cb();
    } else {
      this.timeoutId = setTimeout(() => this.isT0() && cb(), event);
    }
  }

  fire(...args) {
    return new Promise((resolve, reject) => {
      this.once("settled", function (err, response) {
        err ? reject(err) : resolve(response);
      });
      this.state.fire(...args);
    });
  }
  // fire and forget
  ff(...args) {
    this.state.fire(...args);
  }
  yield() {
    return this.inState("pending") ? this.action : this.response;
  }
  reset(force = false) {
    this.state.reset(force);
  }
}

stateful(AsyncAction, [
  Idle,
  "idle",
  Pending,
  "pending",
  Resolved,
  "resolved",
  Rejected,
  "rejected",
]);

eventful(AsyncAction, {
  stateChange: [],
  settled: [],
});

export { AsyncAction };
