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
    return this.team.blockState("register package", true);
  }
  removePackage(remove) {
    return this.team.blockState("remove package", true);
  }
  activate(activate) {
    return this.team.blockState("activate", true);
  }
  pause(pause) {
    return this.team.blockState("pause", true);
  }
}

export { Unregistered };
