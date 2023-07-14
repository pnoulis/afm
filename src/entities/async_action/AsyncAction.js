import { Scheduler } from "./Scheduler.js";

class AsyncAction extends Scheduler {
  constructor(action, options = {}) {
    super(options);
    this.action = action;
  }

  run(...args) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        options: args.at(-1),
        action: function () {
          this.action(...args)
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

export { AsyncAction };
