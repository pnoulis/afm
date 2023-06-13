import backend from "./backend/backend.js";
import { AsyncAction } from "./async_action/index.js";

const loginPlayer = new AsyncAction(function (player) {
  return backend.publish("/player/login", player);
});

const registerPlayer = new AsyncAction(function (player) {
  return backend.publish("/player/register", player);
});

function listAvaibalePlayers(options = {}) {
  return new AsyncAction(function () {
    return backend.publish("/players/list/available");
  }, options);
}

function listAllTeams(options = {}) {
  return new AsyncAction(function () {
    return backend.publish("/teams/all");
  }, options);
}

function listPackages(options = {}) {
  return new AsyncAction(function () {
    return backend.publish("/packages/list");
  }, options);
}

export {
  listAvaibalePlayers,
  listAllTeams,
  listPackages,
  loginPlayer,
  registerPlayer,
};
