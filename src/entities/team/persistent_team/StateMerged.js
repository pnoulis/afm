import { State } from "./State.js";

class Merged extends State {
  constructor(team) {
    super(team);
  }

  merge(merge) {
    return this.team.blockState("merge", true);
  }
  addPlayer(add) {
    return this.team.blockState("addPlayer");
  }
  removePlayer(remove) {
    return this.team.blockState("removePlayer");
  }
  registerPackage(register) {
    return register();
  }
  removePackage(remove) {
    return remove();
  }

  activate(activate) {
    return activate();
  }
  pause(pause) {
    return this.team.blockState("pause");
  }
}

export { Merged };
