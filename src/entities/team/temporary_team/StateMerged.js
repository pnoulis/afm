import { State } from "./State.js";

class Merged extends State {
  constructor(team) {
    super(team);
  }
  addPlayer(add) {
    return this.team.blockState("addPlayer");
  }
  removePlayer(remove) {
    return this.team.blockState("removePlayer");
  }
}

export { Merged };
