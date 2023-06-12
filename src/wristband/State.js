class State {
  constructor(wristband) {
    this.wristband = wristband;
  }

  scan() {
    console.log(`${this.name} scan wristband`);
  }
}

export { State };
