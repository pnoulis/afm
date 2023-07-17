import { Team } from "./Team.js";

class RegularTeam extends Team {
  constructor(Afmachine, team, players) {
    super(Afmachine, team, players);
  }
  register() {
    this.state.register();
  }
  fill(count) {
    this.state.fill(count);
  }
}

export { RegularTeam };
