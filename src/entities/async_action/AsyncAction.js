import { eventful } from "js_utils/eventful";
import { stateful } from "js_utils/stateful";
import { Idle } from "./StateIdle.js";
import { Pending } from "./StatePending.js";
import { Resolved } from "./StateResolved.js";
import { Rejected } from "./StateRejected.js";

class AsyncAction {
  constructor(options = {}) {
    // Stateful initialization
    stateful.construct.call(this);
    // AsyncAction initialization
    this.timePending = options.timePending || 0;
    this.timeResolving = options.timeResolving || 0;
    this.timeRejecting = options.timeRejecting || 0;
    this.queue = [];
  }

  next() {
    this.queue.shift();
    if (this.queue.length) {
      this.setState(this.getPendingState);
      this.queue[0].action.apply(this);
    } else {
      this.setState(this.getIdleState);
    }
  }

  run(action, options = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        options,
        action: function () {
          action()
            .then((res) => this.state.resolved(res))
            .then(resolve)
            .catch((err) => this.state.rejected(err))
            .catch(reject);
        },
      });
      this.state.run();
    });
  }
}

// Stateful
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

// Eventful
eventful(AsyncAction, {
  stateChange: [],
  settled: [],
});

export { AsyncAction };
