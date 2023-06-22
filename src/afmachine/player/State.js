import { WristbandError } from "../errors.js";

class State {
  constructor(player) {
    this.player = player;
  }
  pairWristband(resolve, reject) {
    reject(
      new WristbandError({
        message: `${this.player.state.name} player forbidden from pairing a new wristband`,
        code: 1,
      })
    );
  }
}

export { State };
