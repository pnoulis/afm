class State {
  constructor(subscription) {
    this.subscription = subscription;
  }
  subscribe(resolve, reject) {
    console.log(`${this.subscription.state.name} subscribe`);
  }
  unsubscribe(resolve, reject) {
    console.log(`${this.subscription.state.name} unsubscribe`);
  }
  register(subscriber, options) {
    console.log(`${this.subscription.state.name} register`);
  }
}

export { State };
