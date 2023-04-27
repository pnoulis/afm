import { teamsFactory } from "./team.js";
import { playersFactory } from "./player.js";
import { AFMError, LOGGER } from "./shared.js";
import { Log } from "./log.js";

class AgentFactoryMachine {
  constructor(userConf = {}) {
    const conf = AgentFactoryMachine.parseConf(userConf);
    this.backend = conf.backend;
    this.store = conf.store;
    this.log = new Log(conf.logger);
    this.teams = teamsFactory(this);
    this.players = playersFactory(this);
  }

  static parseConf({ logger, backend, store }) {
    if (!(logger && backend && store)) {
      throw new Error("Incomplete configuration");
    }

    return {
      logger,
      backend,
      store,
    };
  }
}

AgentFactoryMachine.prototype.init = function init() {
  this.backend.init();
};

export { AgentFactoryMachine };
