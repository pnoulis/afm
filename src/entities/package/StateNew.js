import { State } from "./State.js";

class New extends State {
  constructor(pkg) {
    super(pkg);
  }
  start(start) {}
  pause(pause) {}
  unregister(unregister) {}
  register(register) {
    return register();
  }
  pay(pay) {}
}

export { New };
