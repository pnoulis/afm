function createTeam() {
  return new this.Team(this);
}

function createRegularTeam() {
  return new this.RegularTeam(this);
}

function createGroupTeam() {
  return new this.GroupTeam(this);
}

function createWristband() {
  return new this.Wristband(this);
}

function createPlayer() {
  return new this.Player(this);
}

function createPlayerWristband() {
  return new this.PlayerWristband(this);
}

function createGroupPlayerWristband() {
  return new this.GroupPlayerWristband(this);
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
