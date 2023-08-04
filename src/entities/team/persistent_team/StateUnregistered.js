import { State } from "./State.js";

class Unregistered extends State {
  constructor(team) {
    super(team);
  }

  merge(merge) {
    return merge();
  }
  addPlayer(add) {
    return add();
  }
  removePlayer(remove) {
    return remove();
  }
  registerPackage(register) {
    return this.team.blockState("registerPackage");
  }
  removePackage(remove) {
    return this.team.blockState("removePackage");
  }
  activate(activate) {
    return this.team.blockState("activate");
  }
  pause(pause) {
    return this.team.blockState("pause");
  }
}

export { Unregistered };
