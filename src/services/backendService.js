import { TaskRunner } from "js_utils";

function backendService(backend, logger) {
  let isBooted = false;
  const tr = new TaskRunner({
    timeout: 30000,
    isConnected: () => backend.server.connected && isBooted,
  });

  backend.server.on("connect", function notify() {
    logger.info("Backend service connected");
    backend.server.removeListener("connect", notify);
  });

  const service = {
    backend,
  };

  service.start = function start() {
    return new Promise((resolve, reject) => {
      backend
        .publish("/boot", {
          deviceId: backend.id,
          roomName: "registration5",
          deviceType: "REGISTRATION_SCREEN",
        })
        .then((res) => {
          if (res.result === "OK") {
            logger.info("Backend service boot success");
            const publish = backend.publish.bind(backend);
            const subscribe = backend.publish.bind(backend);
            backend.publish = (route, payload, options) =>
              tr.run(() => publish(route, payload, options));
            backend.subscribe = (route, options, cb) =>
              tr.run({ cb: true }, (err) => {
                if (err) return cb(err);
                subscribe(route, options, cb);
              });
            isBooted = true;
            resolve();
          } else {
            throw new Error("Backend service boot failed", { cause: res });
          }
        })
        .catch((err) => {
          logger.error("Backend service boot failed", err);
          reject(err);
        });
    });
  };

  return service;
}

export { backendService };
