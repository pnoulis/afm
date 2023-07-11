import browser from "./browser.js";
import { smallid } from "js_utils/uuid";

// Tab Unique
const TAB_ID = smallid();

const storageService = (function () {
  const persistent = globalThis.window.localStorage;
  const cache = globalThis.window.sessionStorage;
  const service = {};

  /**
   * Service.get
   *
   * @param {string} key
   * @returns {any}
   */
  service.get = function get(storageProvider, db, key = "") {
    let store = {};
    if (db) {
      store = JSON.parse(storageProvider.getItem(db));
      return !!key ? store[key] : store || {};
    }

    if (key) {
      return JSON.parse(storageProvider.getItem(key));
    }

    for (let i = 0; i < storageProvider.length; i++) {
      const k = storageProvider.key(i);
      store[k] = JSON.parse(storageProvider[k]);
    }
    return store;
  };

  /**
   * Service.set
   *
   * @param {string} key
   * @param {any} value
   * @returns {undefined}
   */
  service.set = function set(storageProvider, db, key = "", value = "") {
    try {
      if (db) {
        const store = service.get(storageProvider, db);
        store[key] = value;
        storageProvider.setItem(db, JSON.stringify(store));
        return store;
      }
      storageProvider.setItem(key, JSON.stringify(value));
      return service.get(storageProvider);
    } catch (err) {
      throw new Error(`service.set(${key} ${value}) failed!`, { cause: err });
    }
  };

  /**
   * Service.remove
   *
   * @param {Storage} storageProvider - localStorage || sessionStorage
   * @param {string} TAB_ID
   * @param {string} key
   * @returns {Object} store
   */
  service.remove = function remove(storageProvider, db, key) {
    if (db) {
      const store = service.get(storageProvider, db);
      delete store[key];
      storageProvider.setItem(db, JSON.stringify(store));
      return store;
    }
    storageProvider.removeItem(key);
    return service.get(storageProvider);
  };

  service.clear = function clear(storageProvider, db) {
    if (db) {
      storageProvider.removeItem(db);
    } else {
      storageProvider.clear();
    }
  };
  service.getp = service.get.bind(null, persistent, null);
  service.setp = service.set.bind(null, persistent, null);
  service.rmp = service.remove.bind(null, persistent, null);
  service.cp = service.clear.bind(null, persistent, null);
  service.getc = service.get.bind(null, cache, TAB_ID);
  service.setc = service.set.bind(null, cache, TAB_ID);
  service.rmc = service.remove.bind(null, cache, TAB_ID);
  service.cc = service.clear.bind(null, cache, TAB_ID);

  service.start = function start(clientId) {
    if (!service.getp("clientId")) {
      service.setp("clientId", clientId); // hash this
    }
    service.setc(TAB_ID, {});
    return service;
  };

  service.stop = function stop() {
    service.cc();
  };

  return service;
})();

export { storageService };
