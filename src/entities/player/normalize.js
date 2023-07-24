import { Player } from './Player.js';
import { Wristband } from '../wristband/Wristband.js';

function normalize(player = {}, state = "") {
  const __player = {
    name: player.name || "",
    username: player.username || "",
    surname: player.surname || "",
    email: player.email || "",
    password: player.password ?? "",
    wristband: Wristband.normalize(player.wristband),
  };
  let __state = "";

  if (state) {
    __state = state;
  } else if (Object.hasOwn(player, "wristbandMerged")) {
    if (player.wristbandMerged) {
      if (__player.wristband.state !== "unpaired") {
        __player.state = "inTeam";
      } else {
        throw new Error(
          "WristbandMerged true and player.wristband not paired.",
        );
      }
    } else if (__player.wristband.state !== "unpaired") {
      __player.state = "registered";
    } else {
      __player.state = "unregistered";
    }
    return __player;
  } else if (player instanceof Player) {
    __player.state = player.getState().name;
    return __player;
  } else if (typeof player.state === "string") {
    __state = player.state;
  } else if (__player.wristband.state !== "unpaired") {
    __player.state = "registered";
    return __player;
  } else {
    __player.state = "unregistered";
    return __player;
  }

  const lnStateNames = Player.states.length;
  for (let i = 0; i < lnStateNames; i++) {
    if (Player.states[i] === __state) {
      __player.state = __state;
      return __player;
    }
  }
  throw new Error(`Unrecognized player state ${__state}`);
}

export { normalize };
