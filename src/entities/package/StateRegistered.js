import { State } from "./State.js";

class Registered extends State {
  constructor(pkg) {
    super(pkg);
  }
  start(start) {}
  pause(pause) {}
  unregister(unregister) {}
  register(register) {
    return this.team.blockState("register package", true);
  }
  pay(pay) {}
}

export { Registered };
