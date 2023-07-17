class State {
  constructor(action) {
    this.action = action;
  }
  run() {}
  resolved() {}
  reject() {}
}

export { State };
