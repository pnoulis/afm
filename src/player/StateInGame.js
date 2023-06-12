import { State } from "./State.js";

class InGame extends State {
  constructor(player) {
    super(player);
  }

  register(form) {
    return Promise.reject(new PlayerErrors.ERR_PLAYER_REGISTERED(this.player));
  }
}

export { InGame };
