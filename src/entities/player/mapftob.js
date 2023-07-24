import { Wristband } from "../wristband/index.js";

function mapftob(player = {}) {
  return {
    username: player.username || "",
    name: player.name || "",
    surname: player.surname || "",
    email: player.email || "",
    password: player.password || "",
    wristband: Wristband.mapftob(player.wristband),
    wristbandMerged: player.compareStates(
      (states, current) => current >= states.inTeam,
    ),
  };
}

export { mapftob };
