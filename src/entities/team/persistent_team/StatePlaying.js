import { State } from "./State.js";

class Playing extends State {
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
    return this.team.blockState("registerPackage");
  }
  removePackage(remove) {
    return this.team.blockState("removePackage");
  }
  activate(activate) {
    return this.team.blockState("startPackage");
  }
  pause(pause) {
    return pause();
  }
}

export { Playing };
