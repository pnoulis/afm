function createTeam() {
  return new this.Team(this);
}

function createRegularTeam() {
  return new this.RegularTeam(this);
}

function createGroupTeam() {
  return new this.GroupTeam(this);
}

function createWristband(wristband) {
  return new this.Wristband(this, wristband);
}

function createPlayer(player) {
  return new this.Player(this, player);
}

function createPlayerWristband(player, wristband) {
  return new this.PlayerWristband(this, player, wristband);
}

function createGroupPlayerWristband(groupPlayer, wristband) {
  return new this.GroupPlayerWristband(this, groupPlayer, wristband);
}

export {
  createTeam,
  createRegularTeam,
  createGroupTeam,
  createWristband,
  createPlayer,
  createPlayerWristband,
  createGroupPlayerWristband,
};
