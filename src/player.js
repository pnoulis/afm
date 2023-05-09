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
        .publish("/player/search", {
          searchTerm: player,
        })
        .then((res) =>
          resolve({
            ...res,
            players: res.players.map((p) => ({
              ...p,
              wristband: {
                ...p.wristband,
                pairing: false,
              },
            })),
          })
        )
        .catch((err) => reject(err));
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
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  static async listenWristbandScan() {
    return new Promise((resolve, reject) => {
      this.afm.backend.subscribe(
        "/wristband/scan",
        { mode: "persistent" },
        (err, res) => (err ? reject(err) : resolve(res))
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
}

export { playersFactory };
