import { State } from "./State.js";
import { delay } from "js_utils/misc";

class Pending extends State {
  constructor(action) {
    super(action);
  }

  resolved(response) {
    // minTimePending
    return delay(
      this.action.queue[0]?.options.timePending || this.action.timePending,
    )
      .then(() => {
        this.action.setState(this.action.getResolvedState);
        // minTimeResolving
        return delay(
          this.action.queue[0]?.options.timeResolving ||
            this.action.timeResolving,
        );
      })
      .then(() => {
        this.action.next();
        return response;
      });
  }

  rejected(err) {
    // minTimePending
    return delay(
      this.action.queue[0]?.options.timePending || this.action.timePending,
    )
      .then(() => {
        this.action.setState(this.action.getRejectedState);
        // minTimeRejecting
        return delay(
          this.action.queue[0]?.options.timeRejecting ||
            this.action.timeRejecting,
        );
      })
      .then(() => {
        this.action.next();
        throw err;
      });
  }
}

export { Pending };
