import { Team } from "./Team.js";

class RegularTeam extends Team {
  constructor(team, players) {
    super(team, players);
  }
  register() {
    this.state.register();
  }
  fill(count) {
    this.state.fill(count);
  }
}

export { RegularTeam };
