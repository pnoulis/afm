import { registerPlayer, loginPlayer } from "../actions.js";

class Cashier {
  static registerPlayerState = registerPlayer;
  constructor() {}
}

Cashier.prototype.registerPlayer = function registerPlayer(player) {
  return this.constructor.registerPlayerState.fire(player);
};

Cashier.prototype.loginPlayer = function loginPlayer(player) {};

export { Cashier };
