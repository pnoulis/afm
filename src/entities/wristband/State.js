class State {
  constructor(wristband) {
    this.wristband = wristband;
  }
  scanned() {};
  verified() {};
  registered() {};
  unregistered() {};
  toggle() {};
}

export { State };
