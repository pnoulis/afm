class ERR_PLAYER_REGISTERED extends Error {
  constructor(player) {
    super(`${player.username} already registered`);
    this.name = "ERR_PLAYER_REGISTERED";
  }
}

export { ERR_PLAYER_REGISTERED };
