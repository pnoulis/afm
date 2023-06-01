import { validatePlayer } from "./validate.js";
import { LOGGER, AFMError, mixinErr } from "./shared.js";
import { Wristband } from "./wristband.js";
import * as Errors from "./errors.js";

let log;

function playersFactory(afm) {
  Player.afm ||= afm;
  Player.players ||= new Map();
  return Player;
}

class Player {
  static afm;
  static players;
  constructor(player = {}) {
    const conf = Player.parseConf(player);
    this.wristband = conf.wristband;
    log = LOGGER();
  }

  static parseConf(userConf) {
    const conf = {};
    conf.wristband = new Wristband();
    return userConf;
  }

  /**
   * Login a player
   *
   * @async
   * @param {object} player
   * @param {string} player.username
   * @param {string} player.password
   * @returns {object} player - Logged in player
   * @returns {string} player.username
   * @returns {string} player.email
   * @returns {null} player.name
   * @returns {null} player.surname
   * @throws {(TimeoutError|ValidationError|ModelError|Error)} The validation
   * errors are stored in: ValidationError.cause.validationErrors
   **/
  static async login(player) {
    return new Promise((resolve, reject) => {
      validatePlayer.login(player, (validationErrors) =>
        reject(new Errors.ValidationError(validationErrors))
      );

      Player.afm.backend
        .publish("/player/login", player)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
      // .catch((err) => mixinErr("Failed player login", err, reject));
    });
  }

  /**
   * Register a player
   *
   * @async
   * @param {object} player
   * @param {string} player.username
   * @param {string} player.name
   * @param {string} player.surname
   * @param {string} player.email
   * @param {string} [player.password]
   * @returns {object} player - Registered player
   * @returns {string} player.username
   * @returns {string} player.email
   * @returns {null} player.name
   * @returns {null} player.surname
   * @throws {(TimeoutError|ValidationError|ModelError|Error)} The validation
   * errors are stored in: ValidationError.cause.validationErrors
   **/
  static async register(player) {
    return new Promise((resolve, reject) => {
      validatePlayer.registration(player, (validationErrors) =>
        reject(new Errors.ValidationError(validationErrors))
      );

      this.afm.backend
        .publish("/player/register", player)
        .then((res) => resolve(res))
        .catch((err) => mixinErr("Failed player registration", err, reject));
    });
  }

  /**
   * List all registered players
   *
   * @async
   * @returns {array<object>} players
   * @returns {string} player.username
   **/
  static async list() {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/players/list")
        .then((res) => resolve(res))
        .catch((err) => reject(err));
      // this.afm.backend
      //   .publish("/players/list")
      //   .then((res) => resolve(res))
      //   .catch((err) => mixinErr("Failed to list players", err, reject));
    });
  }

  /**
   * Search a player
   *
   * @async
   * @param {string} searchTerm
   * @returns {array<object>} payload
   **/
  static async search(player) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/player/search", { searchTerm: player })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Register wristband to player
   *
   * @async
   * @param {object} payload
   * @param {string} payload.username
   * @param {integer} payload.wristbandNumber
   * @returns {object} payload
   **/
  static async registerWristband(payload) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/wristband/register", payload)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  /**
   * Unregister wristband
   **/
  static async unregisterWristband(payload) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/wristband/unregister", payload)
        .then(resolve)
        .catch(reject);
    });
  }

  static async subscribeWristbandScan(listener, { mode = "persistent" } = {}) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .subscribe("/wristband/scan", { mode }, listener)
        .then(resolve)
        .catch((err) => {
          reject({
            result: "NOK",
            message: "Failed to subscribe to wristband scan, SERVER ERROR",
          });
        });
    });
  }

  /**
   * Subscribe wristband registration
   *
   *
   **/
  static async subscribeWristbandRegistration(
    listener,
    { mode = "persistent" } = {}
  ) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .subscribe("/wristband/register", { mode }, listener)
        .then(resolve)
        .catch((err) => {
          reject({
            result: "NOK",
            message: "Failed to subscribe to wristband register, SERVER ERROR",
          });
        });
    });
  }

  /**
   * Subscribe wristband unregistration
   **/
  static async subscribeWristbandUnregistration(
    listener,
    { mode = "persistent" } = {}
  ) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .subscribe("/wristband/unregister", { mode }, listener)
        .then(resolve)
        .catch((err) =>
          reject({
            result: "NOK",
            message:
              "Failed to subscribe to wristband unregistration, SERVER ERROR",
          })
        );
    });
  }

  /**
   * List available players
   * Returns players which are not part of a team and have a registered
   * wristband
   **/
  static async listAvailable() {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/players/list/available")
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Create team
   **/

  static async createTeam(payload) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/team/merge", payload)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Team statistics
   **/

  static async listTeams() {
    return new Promise((resolve, reject) => {
      this.afm.backend.publish("/teams/all").then(resolve).catch(reject);
    });
  }

  /**
   * Wristband Info
   **/

  static async infoWristband(wristband) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/wristband/info", wristband)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Create group team
   **/

  static async createGroupTeam(groupTeam) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/groupteam/merge", groupTeam)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * List Available packages
   **/
  static async listPackages() {
    return new Promise((resolve, reject) => {
      this.afm.backend.publish("/packages/list").then(resolve).catch(reject);
    });
  }

  /**
   * Add package
   **/
  static async addPackage(payload) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/team/package/add", payload)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Remove package
   **/
  static async removePackage(payload) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/team/package/delete", payload)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Start playing
   **/

  static async startPlay(payload) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/team/activate", payload)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Stop play
   **/

  static async stopPlay(payload) {
    return new Promise((resolve, reject) => {
      this.afm.backend
        .publish("/team/deactivate", payload)
        .then(resolve)
        .catch(reject);
    });
  }
}

export { playersFactory };
