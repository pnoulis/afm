import { eventful } from "../../misc/eventful.js";
import { stateful } from "../../misc/stateful.js";
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
    } = {}
  ) {
    Object.assign(
      this,
      stateful.call(this, {
        idle: new Idle(this),
        pending: new Pending(this),
        resolved: new Resolved(this),
        rejected: new Rejected(this),
      })
    );

    Object.assign(
      this,
      eventful.call(this, {
        stateChange: [],
        resolved: [],
        rejected: [],
        error: [],
      })
    );
    Object.assign(this.options, {
      ...this.options,
      fireDelay,
      minTimePending,
      minTimeResolving,
      minTimeRejecting,
    });

    this.timeoutId = undefined;
    this.action = action;
    this.resolve = [];
    this.reject = [];
    this.response = null;
    this.setState(this.getIdleState);
  }

  changeState(state, cb) {
    const previousState = this.state.name;
    this.setState(state, () => {
      this.emit("stateChange", previousState, this.state.name);
      cb && cb();
    });
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

  async _fire(...args) {
    try {
      this.response = await this.action(...args);
      this.state.resolve(this.response);
    } catch (err) {
      this.respnose = err;
      this.state.reject(this.response);
    }
  }
  fire(...args) {
    return new Promise((resolve, reject) => {
      try {
        this.state.fire(...args);
        this.resolve.push(resolve);
        this.reject.push(reject);
      } catch (err) {
        reject(err);
      }
    });
  }
  // fire and forget
  ff(...args) {
    this.state.fire(...args);
  }
  yield() {
    return this.response;
  }
  reset() {
    this.state.reset();
  }
}

export { AsyncAction };
