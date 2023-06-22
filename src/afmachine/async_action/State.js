class State {
  constructor(action) {
    this.action = action;
  }

  fire() {
    console.log(`${this.action.state.name} fire`);
  }
}

export { State };
