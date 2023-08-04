import { State } from "./State.js";

class Paused extends State {
  constructor(pkg) {
    super(pkg);
  }
  start(start) {}
  pause(pause) {}
  unregister(unregister) {}
  register(register) {}
  pay(pay) {}
}

export { Paused };
