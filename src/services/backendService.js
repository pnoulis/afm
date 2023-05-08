import { TaskRunner } from "js_utils";

function backendService(backend, logger) {
  const service = {
    connected: backend.server.connected,
    isBooted: false,
    initialized: false,
    backend,
  };

  const tr = new TaskRunner({
    timeout: 30000,
    isConnected: () => service.connected && service.isBooted,
  });

  backend.server.on("connect", function notify() {
    logger.info("Backend service connected");
    service.connected = true;
    backend.server.removeListener("connect", notify);
  });

  service.init = function init() {
    return new Promise((resolve, reject) => {
      console.log("PUBLISHING BACKEND BOOTED");
      backend
        .publish("/boot", {
          deviceId: backend.id,
          roomName: "registration5",
          deviceType: "REGISTRATION_SCREEN",
        })
        .then((res) => {
          console.log("BACKNED BOOTED RESPONSE");
          if (res.result === "OK") {
            logger.info("Backend service boot success");
            service.publish = (route, payload, options) =>
              backend.publish(route, payload, options);
            service.subscribe = (route, options, cb) =>
              backend.subscribe(route, options, cb);
            // const publish = backend.publish.bind(backend);
            // const subscribe = backend.publish.bind(backend);
            // backend.publish = (route, payload, options) =>
            //   tr.run(() => publish(route, payload, options));
            // backend.subscribe = (route, options, cb) =>
            //   tr.run({ cb: true }, (err) => {
            //     if (err) return cb(err);
            //     subscribe(route, options, cb);
            //   });
            service.isBooted = true;
            resolve();
          } else {
            console.log("BACKEND BOOTED NOK");
            throw new Error("Backend service boot failed", { cause: res });
          }
        })
        .catch((err) => {
          console.log("BACKEND BOOTED ERROR");
          console.log(err);
          logger.error("Backend service boot failed", err);
          reject(err);
        });
    });
  };

  return service;
}

export { backendService };
