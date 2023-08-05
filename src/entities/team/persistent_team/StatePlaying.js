import { State } from "./State.js";

class Playing extends State {
  constructor(team) {
    super(team);
  }
  merge(merge) {
    return this.team.blockState("merge", true);
  }
  addPlayer(add) {
    return this.team.blockState("add player");
  }
  removePlayer(remove) {
    return this.team.blockState("remove player");
  }
  registerPackage(register) {
    return this.team.blockState("register package", true);
  }
  removePackage(remove) {
    return this.team.blockState("remove package", true);
  }
  activate(activate) {
    return this.team.blockState("start package", true);
  }
  pause(pause) {
    return pause();
  }
}

export { Playing };
