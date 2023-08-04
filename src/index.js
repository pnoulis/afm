import { ENVIRONMENT } from "agent_factory.shared/config.js";
import { Pipeline } from "js_utils/pipeline";
import { parseResponse } from "./middleware/backend/parseResponse.js";
import * as routes from "./routes/backend/index.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { LoggerService } from "agent_factory.shared/services/logger/LoggerService.js";
import { LocalStorageService } from "agent_factory.shared/services/client_storage/local_storage/index.js";
import { CreateBackendService } from "agent_factory.shared/services/backend/CreateBackendService.js";
import { lockWristbandScan } from "./afmachine/lockWristbandScan.js";
import * as creates from "./afmachine/creates.js";
import { AsyncAction } from "./entities/async_action/index.js";

function Afmachine() {
  this.clientId = "001";
  this.clientName = "afclient";

  // Services
  this.services = {};
  // cache storage
  if (ENVIRONMENT.RUNTIME === "browser") {
    this.services.storage = new LocalStorageService(this.clientId);
    this.services.storage.start();
    this.clientId = this.services.storage.sessionId;
  } else {
    this.clientId = "001";
  }
  // logging
  this.services.logger = new LoggerService(this.clientId, this.clientName);
  // backend api
  this.services.backend = CreateBackendService(this.clientId);

  // Middleware
  this.middleware = {
    parseResponse,
  };

  // Pipeline
  this.pipeline = new Pipeline();
  this.pipeline.setAfterAll(async (context, next, err) => {
    if (err) {
      if (/timeout/.test(err.message)) {
        err = new aferrs.ERR_TIMEOUT();
      }
      // err.context = context;
      context.res = context.res.payload;
      throw err;
    }
    context.res = context.res.payload;
    await next();
  });
  this.pipeline.setGlobalLast((context, next, err) => {
    if (err) {
      // this.services.logger.error(err);
      throw err;
    }
    // this.services.logger.debug(context);
    next();
  });

  // Routes
  this.addPackage = this.pipeline.route(...routes.addPackage(this));
  this.boot = this.pipeline.route(...routes.boot(this));
  this.getWristbandScan = this.pipeline.route(...routes.getWristbandScan(this));
  this.listPackages = this.pipeline.route(...routes.listPackages(this));
  this.listRegisteredWristbandPlayers = this.pipeline.route(
    ...routes.listRegisteredWristbandPlayers(this),
  );
  this.listTeams = this.pipeline.route(...routes.listTeams(this));
  this.loginPlayer = this.pipeline.route(...routes.loginPlayer(this));
  this.mergeGroupTeam = this.pipeline.route(...routes.mergeGroupTeam(this));
  this.mergeTeam = this.pipeline.route(...routes.mergeTeam(this));
  this.onMergeTeam = this.pipeline.route(...routes.onMergeTeam(this));
  this.registerPlayer = this.pipeline.route(...routes.registerPlayer(this));
  this.registerWristband = this.pipeline.route(
    ...routes.registerWristband(this),
  );
  this.onRegisterWristband = this.pipeline.route(
    ...routes.onRegisterWristband(this),
  );
  this.unregisterWristband = this.pipeline.route(
    ...routes.unregisterWristband(this),
  );
  this.onUnregisterWristband = this.pipeline.route(
    ...routes.onUnregisterWristband(this),
  );
  this.removePackage = this.pipeline.route(...routes.removePackage(this));
  this.searchPlayer = this.pipeline.route(...routes.searchPlayer(this));
  this.startTeam = this.pipeline.route(...routes.startTeam(this));
  this.verifyWristband = this.pipeline.route(...routes.verifyWristband(this));
}

Afmachine.prototype.lockWristbandScan = lockWristbandScan;
Afmachine.prototype.createWristband = creates.createWristband;
Afmachine.prototype.createScanableWristband = creates.createScannableWristband;
Afmachine.prototype.createVerifiableWristband =
  creates.createVerifiableWristband;
Afmachine.prototype.createRegistableWristband =
  creates.createRegistableWristband;
Afmachine.prototype.createPlayer = creates.createPlayer;
Afmachine.prototype.createPersistentPlayer = creates.createPersistentPlayer;
Afmachine.prototype.createTemporaryPlayer = creates.createTemporaryPlayer;
Afmachine.prototype.createTeam = creates.createTeam;
Afmachine.prototype.createPersistentTeam = creates.createPersistentTeam;
Afmachine.prototype.createTemporaryTeam = creates.createTemporaryTeam;
Afmachine.prototype.createRoster = creates.createRoster;
Afmachine.prototype.createGroupParty = creates.createGroupParty;
Afmachine.prototype.createPkg = creates.createPkg;

const afmachine = new Afmachine();
export { afmachine, AsyncAction };
export * from "./misc/log.js";
