import { CLIENT_STORAGE_GLOBAL_SESSION_ID } from "agent_factory.shared/constants.js";

function getGlobalStorage(storage, key, cb) {
  const gsession = storage.global.get(CLIENT_STORAGE_GLOBAL_SESSION_ID);
  if (!gsession) {
    storage.global.set(CLIENT_STORAGE_GLOBAL_SESSION_ID, {});
  }
}

function getUserStorage(storage, key, create = true) {}
