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
  startPackage(start) {
    return this.team.blockState("startPackage");
  }
}

export { Unregistered };
