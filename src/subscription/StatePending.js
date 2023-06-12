import { State } from "./State.js";

class Pending extends State {
  constructor(subscription) {
    super(subscription);
  }
  subscribe(resolve, reject) {
    this.subscription.on(
      "connected",
      () => {
        this.subscription.flush("*", "pending");
        resolve();
      },
      {
        id: "pending",
      }
    );
    this.subscription.on(
      "error",
      (err) => {
        this.subscription.flush("*", "pending");
        reject(err);
      },
      { id: "pending" }
    );
  }
  unsubscribe(resolve, reject) {
    this.subscription.on(
      "connected",
      () => {
        this.subscription.flush("*", "pending");
        this.subscription._unsubscribe().then(resolve).catch(reject);
      },
      { id: "pending" }
    );
    this.subscription.on(
      "error",
      (err) => {
        this.subscription.flush("*", "pending");
        reject(err);
      },
      { id: "pending" }
    );
  }
  register(subscriber, options) {
    return this.subscription._register(subscriber, options);
  }
}

export { Pending };
