class State {
  constructor(wristband) {
    this.wristband = wristband;
  }

  scan() {
    console.log(`${this.name} scan wristband`);
  }
  verify() {}
  register(player) {}
  unregister(player) {}
  unpair(player) {}
}

export { State };
