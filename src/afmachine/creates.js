import { Roster } from "../entities/roster/index.js";

function createTeam(team) {
  return new this.Team(this, this.Team.normalize(team));
}

function createRegularTeam(team) {
  let __team = this.Team.normalize(team);
  let __roster = new this.Roster(
    __team.roster,
    this.createPersistentPlayer.bind(this),
  );
  return new this.Team(this, __team, __roster);
}

function createGroupTeam() {
  return new this.GroupTeam(this);
}

function createWristband(wristband) {
  return new this.Wristband(wristband);
}

function createLiveWristband(wristband) {
  return new this.LiveWristband(this, wristband);
}

function createGroupPlayerWristband(player, wristband) {
  return new this.GroupPlayerWristband(this, player, wristband);
}

function createPlayerWristband(player, wristband) {
  return new this.PlayerWristband(
    this,
    player && player instanceof this.Player
      ? this.Player.normalize(player)
      : player,
    wristband && wristband instanceof this.Wristband
      ? this.Wristband.normalize(wristband)
      : wristband,
  );
}

function createPlayer(player) {
  return new this.Player(
    player && player instanceof this.Player
      ? this.Player.normalize(player)
      : player,
  );
}

function createPersistentPlayer(player) {
  return new this.PersistentPlayer(
    this,
    player && player instanceof this.Player
      ? this.Player.normalize(player)
      : player,
  );
}

export {
  createTeam,
  createRegularTeam,
  createGroupTeam,
  createWristband,
  createLiveWristband,
  createPlayerWristband,
  createGroupPlayerWristband,
  createPlayer,
  createPersistentPlayer,
};
