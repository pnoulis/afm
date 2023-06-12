import { State } from "./State.js";

class Down extends State {
  constructor(subscription) {
    super(subscription);
  }
  subscribe(resolve, reject) {
    this.subscription._subscribe().then(resolve).catch(reject);
    this.subscription.changeState(this.subscription.getPendingState);
  }
  unsubscribe(resolve) {
    resolve();
  }
  register(subscriber, options) {
    this.subscription._subscribe();
    return this.subscription._register(subscriber, options);
  }
}

export { Down };
