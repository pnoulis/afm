import {
  Wristband,
  LiveWristband,
  ScannableWristband,
  VerifiableWristband,
  RegistableWristband,
} from "../entities/wristband/index.js";
import {
  Player,
  PersistentPlayer,
  TemporaryPlayer,
} from "../entities/player/index.js";
import { Team, TemporaryTeam, PersistentTeam } from "../entities/team/index.js";
import { GroupParty } from "../entities/group_party/index.js";
import { Roster } from "../entities/roster/index.js";
import { Package } from "../entities/package/index.js";

function createWristband(wristband) {
  return new Wristband(Wristband.normalize(wristband));
}
function createScannableWristband(wristband) {
  return new ScannableWristband(this, Wristband.normalize(wristband));
}
function createVerifiableWristband(wristband, player) {
  return new VerifiableWristband(this, Wristband.normalize(wristband), player);
}
function createRegistableWristband(wristband, player) {
  return new RegistableWristband(this, Wristband.normalize(wristband), player);
}
function createPlayer(player) {
  return new Player(Player.normalize(player));
}
function createPersistentPlayer(player, options) {
  return new PersistentPlayer(this, Player.normalize(player, options));
}
function createTemporaryPlayer(player) {
  return new TemporaryPlayer(this, Player.normalize(player));
}
function createTeam(team) {
  return new Team(Team.normalize(team));
}
function createPersistentTeam(team, options) {
  return new PersistentTeam(this, Team.normalize(team, options));
}
function createTemporaryTeam(team, options) {
  return new TemporaryTeam(this, Team.normalize(team, options));
}
function createRoster(roster) {
  return new Roster(Roster.normalize(roster));
}
function createGroupParty(groupParty) {
  return new GroupParty(this, GroupParty.normalize(groupParty));
}
function createPkg(source, team, options) {
  return new Package(this, Package.normalize(source, options), team);
}

export {
  createWristband,
  createScannableWristband,
  createVerifiableWristband,
  createRegistableWristband,
  createPlayer,
  createPersistentPlayer,
  createTemporaryPlayer,
  createTeam,
  createPersistentTeam,
  createTemporaryTeam,
  createRoster,
  createGroupParty,
  createPkg,
};
