import { State } from "./State.js";

class Up extends State {
  constructor(subscription) {
    super(subscription);
  }
  subscribe(resolve) {
    resolve();
  }
  unsubscribe(resolve, reject) {
    this.subscription._unsubscribe().then(resolve).catch(reject);
  }
  register(subscriber, options) {
    return this.subscription._register(subscriber, options);
  }
}

export { Up };
