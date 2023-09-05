import { State } from "./State.js";

class Merged extends State {
  constructor(team) {
    super(team);
  }
  merge(merge) {
    return this.team.blockState(
      `${this.team.name} is already merged`,
      "merge",
      true,
    );
  }
  addPlayer(add) {
    return this.team.blockState(
      `Team is already merged. Cannot add player`,
      "add player",
    );
  }
  removePlayer(remove) {
    return this.team.blockState(
      `Team is already merged. Cannot remove player`,
      "remove player",
    );
  }
}

export { Merged };
