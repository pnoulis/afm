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
  removePackage(remove) {
    return remove();
  }

  activate(activate) {
    return this.team.blockState("activate");
  }
  pause(pause) {
    return this.team.blockState("pause");
  }

}

export { Registered };
