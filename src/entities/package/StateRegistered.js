import { State } from "./State.js";

class Registered extends State {
  constructor(pkg) {
    super(pkg);
  }
  start(start) {}
  pause(pause) {}
  unregister(unregister) {}
  register(register) {}
  pay(pay) {}
}

export { Registered };
