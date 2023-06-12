class State {
  constructor(player) {
    this.player = player;
  }
  register() {
    console.log(`${this.name} register`);
  }
  unregister() {
    console.log(`${this.name} unregister`);
  }
  pairWristband() {
    console.log(`${this.name} pair wristband`);
  }
}

export { State };
