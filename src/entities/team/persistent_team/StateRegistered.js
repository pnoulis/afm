import { State } from "./State.js";

class Registered extends State {
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
    return register();
  }
  startPackage(start) {
    return this.team.blockState("startPackage");
  }

}

export { Registered };
